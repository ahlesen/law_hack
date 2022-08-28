import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

import docx
import re
import pickle
import pandas as pd
import numpy as np

from constants import subject, subject_dict
from sklearn.pipeline import make_pipeline
from lime.lime_text import LimeTextExplainer
from tqdm import tqdm

from transformers import AutoModel, AutoTokenizer, BertForSequenceClassification
import torch
import torch.nn.functional as F
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler

# from keras.preprocessing.sequence import pad_sequences
from keras_preprocessing.sequence import pad_sequences


UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)),"uploads_docs")
ALLOWED_EXTENSIONS = {"docx", "doc"}

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


### UPLOAD_MODELS
VECTORIZER_TFIDF_PATH = "models/tfidf_model.pickle"
tfidf_transformer = pickle.load(open(VECTORIZER_TFIDF_PATH, "rb"))

LOGREG_MODEL_PATH = "models/logreg_model.pickle"
model_tfidf = pickle.load(open(LOGREG_MODEL_PATH, "rb"))


SVM_MODEL_PATH = "models/svm_model.pickle"
model_svm = pickle.load(open(SVM_MODEL_PATH, "rb"))
### UPLOAD LIME_explainer
c_tfidf = make_pipeline(tfidf_transformer, model_tfidf)
# c_svm = make_pipeline(tfidf_transformer, model_svm)

explainer = LimeTextExplainer(class_names=[i for i in range(40)])

###UPLOAD_BERT
device = "cpu"
model_name = "DeepPavlov/rubert-base-cased"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model_bert = BertForSequenceClassification.from_pretrained(model_name, num_labels=40)
PATH = "models/epoch_new_bert_dict_4.ckpt"
model_bert.load_state_dict(torch.load(PATH, map_location=torch.device("cpu")))
model_bert.eval()

### functions for doc_analysis
def get_text(doc):
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text.strip())
    fullText = [elem for elem in fullText if len(elem) > 0]
    return fullText


def get_first_index(fullText):
    ind_start = 0
    for i in range(len(fullText) - 1):
        if ("правила" in fullText[i].lower()) and (
            "предоставления" in fullText[i + 1].lower()
        ):
            ind_start = i
            break
    return ind_start


def get_end_index(
    fullText,
    ind_start,
):
    end_start = len(fullText)
    for i in range(ind_start, len(fullText) - 1):
        if (
            (
                fullText[i].lower().startswith("утвержден")
                & fullText[i + 1].lower().startswith("постановлением правительства")
            )
            | (
                ("приложение №" in fullText[i].lower())
                & ("предоставления" in fullText[i + 1].lower())
            )
            | (
                ("приложение №" in fullText[i].lower())
                & ("предоставления" in fullText[i].lower())
            )
            | (
                ("приложение N" in fullText[i].lower())
                & ("предоставления" in fullText[i + 1].lower())
            )
            | (
                ("приложение" in fullText[i].lower())
                & ("к правилам предоставления" in fullText[i + 1].lower())
            )
        ):
            if (i < end_start - 6) & ("правила" in fullText[i + 4].lower()) and (
                "предоставления" in fullText[i + 5].lower()
            ):
                continue
            end_start = i
            break
    return end_start


def document_processing(full_path):
    doc = docx.Document(full_path)
    fullText = get_text(doc)

    # сегментируем, где у нас потенциально есть классы
    # ищем начало раздела Правила предоставления ...
    ind_start = get_first_index(fullText)
    # ищем конец раздела Правила предоставления ...
    end_start = get_end_index(fullText, ind_start)
    # идем дальше по сегменту, чтобы начать анализ не с загаловка
    target_data = []
    activate_flag = False
    real_start_real = ind_start
    for num_el, elem in enumerate(fullText[ind_start:end_start]):
        if not activate_flag:
            # считаю, что анализ после заголовка нужно начинать если идёт 1. и тд (мб ошибочно)
            if len(re.findall("\d+\. ", elem)) > 0:
                real_start_real += num_el
                activate_flag = True
                target_data.append(elem.replace("\xa0", " "))
        else:
            target_data.append(elem.replace("\xa0", " "))

    ### блок Тестовый не важен
    # check mistake END - навряд ли будет тк нет разметки, но оставим
    if end_start < len(fullText):
        for num, elem in enumerate(fullText[end_start:]):
            if len(re.findall("\{\d+\}", elem)) > 0:
                print("ERROR mistake END", num + end_start, elem)
    # check mistake START - навряд ли будет тк нет разметки, но оставим
    if ind_start == 0:
        print("анадлиз документ идёт с самого начала")
    elif ind_start < len(fullText):
        for num, elem in enumerate(fullText[:ind_start]):
            if len(re.findall("\{\d+\}", elem)) > 0:
                print(num + end_start, elem)
    ### блок Тестовый КОНЕЦ
    return target_data, fullText, end_start, real_start_real


### functions for doc_analysis END


def model_sklearn_inference(ref_text, text_transformer, model):
    # убираем лишнее - пунктуацию  и тд
    X_text = text_transformer.transform(ref_text)
    y_pred = model.predict(X_text)
    y_proba = model.predict_proba(X_text)
    return y_pred, y_proba


def prepare_data_bert(ref_text, tokenizer):
    tokenized_texts = [tokenizer.tokenize(sent) for sent in ref_text]
    input_ids = [tokenizer.convert_tokens_to_ids(x) for x in tokenized_texts]

    input_ids = pad_sequences(
        input_ids, maxlen=256, dtype="long", truncating="post", padding="post"
    )
    attention_masks = [[float(i > 0) for i in seq] for seq in input_ids]

    prediction_inputs = torch.tensor(input_ids)
    prediction_masks = torch.tensor(attention_masks)
    # заглушка
    prediction_labels = torch.tensor([[0] for _ in range(len(ref_text))])
    prediction_data = TensorDataset(
        prediction_inputs, prediction_masks, prediction_labels
    )

    prediction_dataloader = DataLoader(
        prediction_data, sampler=SequentialSampler(prediction_data), batch_size=32
    )
    return prediction_dataloader


def bert_torch_inference(model, prediction_dataloader):
    model.eval()
    test_preds, test_labels = [], []
    test_probas = []
    for batch in tqdm(prediction_dataloader):
        # добавляем батч для вычисления на GPU
        batch = tuple(t.to(device) for t in batch)

        # Распаковываем данные из dataloader
        b_input_ids, b_input_mask, b_labels = batch

        # При использовании .no_grad() модель не будет считать и хранить градиенты.
        # Это ускорит процесс предсказания меток для тестовых данных.
        with torch.no_grad():
            logits = model(
                b_input_ids, token_type_ids=None, attention_mask=b_input_mask
            )
        probabilities = F.softmax(logits[0].detach(), dim=-1).cpu().numpy()
        probabilities = np.max(probabilities, axis=1)
        # Перемещаем logits и метки классов на CPU для дальнейшей работы
        logits = logits[0].detach().cpu().numpy()
        label_ids = b_labels.to("cpu").numpy()

        # Сохраняем предсказанные классы и ground truth
        batch_preds = np.argmax(logits, axis=1)
        batch_labels = np.concatenate(label_ids)
        test_preds.extend(batch_preds)
        test_labels.extend(batch_labels)
        test_probas.extend(probabilities)

    y_pred = test_preds
    y_proba = test_probas
    return y_pred, y_proba


def get_doc_info(y_pred, y_proba, mode="sklearn"):
    if mode == "bert":
        s = y_proba
    else:
        s = []
        for i in range(len(y_pred)):
            k = y_pred[i]
            s.append(y_proba[i, k])

    df_res = pd.DataFrame()
    df_res["proba"] = s
    df_res["preds"] = y_pred

    df_res = df_res.groupby("preds")["proba"].mean().reset_index()

    df_dump = pd.DataFrame()
    df_dump["preds"] = [x for x in range(1, 40)]
    df_dump = df_dump.merge(df_res, on="preds", how="left")
    df_dump["proba"] = df_dump["proba"] * 100
    df_dump["proba"] = df_dump["proba"].round(1)
    df_dump.fillna("отсутствует в документе", inplace=True)
    # make contract doc_ok
    percent = round(df_res.shape[0] / 39 * 100, 1)
    ok = True if percent >= 0.8 else False
    doc_ok = {
        "percent": percent,
        "ok": ok,
    }
    # make contract doc_report
    model_confident = list(df_dump["proba"])
    class_name = [i for i in range(1, 40)]
    doc_report = {
        "class_name": class_name,
        "subject": subject,
        "model_confident": model_confident,
    }

    # prepare probability
    s = [elem * 100 for elem in s]
    s = [round(elem, 2) for elem in s]
    return doc_ok, doc_report, s


def get_doc_analysis(fullText, real_start_real, end_start, y_pred, s, all_spans):
    doc_analysis = []
    for text in fullText[:real_start_real]:
        elem_dict = dict()
        elem_dict["text"] = text
        elem_dict["class"] = "0"
        elem_dict["spans"] = []
        elem_dict["proba"] = 0
        doc_analysis.append(elem_dict)

    for text, pred1, proba1, span1 in zip(
        fullText[real_start_real:end_start], y_pred, s, all_spans
    ):
        elem_dict = dict()
        elem_dict["text"] = text
        elem_dict["class"] = subject_dict[pred1]
        elem_dict["spans"] = span1
        elem_dict["proba"] = proba1
        doc_analysis.append(elem_dict)

    for text in fullText[end_start:]:
        elem_dict = dict()
        elem_dict["text"] = text
        elem_dict["class"] = "0"
        elem_dict["spans"] = []
        elem_dict["proba"] = 0
        doc_analysis.append(elem_dict)
    return doc_analysis


def get_spans(target_data, ref_text, y_pred, c, explainer):
    all_spans = []
    for idx in tqdm(range(len(ref_text))):
        if y_pred[idx] == 0:
            all_spans.append([])
        exp = explainer.explain_instance(
            ref_text[idx], c.predict_proba, labels=[y_pred[idx]]
        )

        key_words = exp.as_list(label=y_pred[idx])

        spans_elem = []
        for key_word in key_words:
            entity_ = {}
            entity_["start"] = target_data[idx].lower().index(key_word[0])
            entity_["end"] = entity_["start"] + len(key_word[0])
            entity_["value"] = key_word[1]
            entity_["text"] = key_word[0]
            spans_elem.append(entity_)
        all_spans.append(spans_elem)
    return all_spans


@app.route("/", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def upload_file():
    if request.method == "POST":
        ### SAVE file block
        # check if the post request has the file part
        if "file" not in request.files:
            flash("No file part")
            return redirect(request.url)
        file = request.files["file"]
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == "":
            flash("No selected file")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            full_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(full_path)
            ### SAVE file block END

            target_data, fullText, end_start, real_start_real = document_processing(
                full_path
            )
            ref_text = [re.sub("[\W\d]+", " ", x.lower()) for x in target_data]
            ### pred for model1
            y_pred1, y_proba1 = model_sklearn_inference(
                ref_text=ref_text, text_transformer=tfidf_transformer, model=model_tfidf
            )
            doc_ok1, doc_report1, probas1 = get_doc_info(y_pred1, y_proba1)
            # make contract doc_analysis1
            if len(y_pred1) != len(fullText[real_start_real:end_start]):
                print("ERORR len y_pred & full_text segmented")

            all_spans1 = get_spans(target_data, ref_text, y_pred1, c_tfidf, explainer)

            doc_analysis1 = get_doc_analysis(
                fullText, real_start_real, end_start, y_pred1, probas1, all_spans1
            )
            if len(doc_analysis1) != len(fullText):
                print("Error doc_analysis shape")

            model1 = {
                "doc_ok": doc_ok1,
                "doc_report": doc_report1,
                "doc_analysis": doc_analysis1,
            }
            ### pred for model1 END

            ### pred for model2
            y_pred2, y_proba2 = model_sklearn_inference(
                ref_text=ref_text, text_transformer=tfidf_transformer, model=model_svm
            )
            doc_ok2, doc_report2, probas2 = get_doc_info(y_pred2, y_proba2)
            # make contract doc_analysis2
            if len(y_pred2) != len(fullText[real_start_real:end_start]):
                print("ERORR len y_pred & full_text segmented")

            # all_spans2 = get_spans(target_data, ref_text, y_pred2, c_svm, explainer)
            all_spans2 = [[] for _ in range(len(y_pred2))]

            doc_analysis2 = get_doc_analysis(
                fullText, real_start_real, end_start, y_pred2, probas2, all_spans2
            )
            if len(doc_analysis2) != len(fullText):
                print("Error doc_analysis shape")
            model2 = {
                "doc_ok": doc_ok2,
                "doc_report": doc_report2,
                "doc_analysis": doc_analysis2,
            }
            ### pred for model2 END

            ### pred for BERT
            prediction_dataloader = prepare_data_bert(ref_text, tokenizer)
            y_pred_bert, y_proba_bert = bert_torch_inference(
                model_bert, prediction_dataloader
            )

            doc_ok_bert, doc_report_bert, probas_bert = get_doc_info(
                y_pred_bert, y_proba_bert, mode="bert"
            )
            # make contract doc_analysis2
            if len(y_pred_bert) != len(fullText[real_start_real:end_start]):
                print("ERORR len y_pred & full_text segmented")

            all_spans_bert = [[] for _ in range(len(y_pred_bert))]

            doc_analysis_bert = get_doc_analysis(
                fullText,
                real_start_real,
                end_start,
                y_pred_bert,
                probas_bert,
                all_spans_bert,
            )
            if len(doc_analysis_bert) != len(fullText):
                print("Error doc_analysis shape")
            model3 = {
                "doc_ok": doc_ok_bert,
                "doc_report": doc_report_bert,
                "doc_analysis": doc_analysis_bert,
            }
            ### pred for BERT END

            return jsonify(model1=model1, model2=model2, model3=model3)
    return """
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    """


if __name__ == "__main__":
    # app.run(host="83.136.233.81", port=5000)
    app.run(host="0.0.0.0", port=5000)
