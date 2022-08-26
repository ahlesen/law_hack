import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle
import json

###
from natasha import (
    Segmenter,
    MorphVocab,
    
    NewsEmbedding,
    NewsMorphTagger,
    NewsSyntaxParser,
    NewsNERTagger,
    
    PER,
    NamesExtractor,

    Doc
)
from ipymarkup import (
    format_span_box_markup, format_span_line_markup, format_span_ascii_markup,
)

segmenter = Segmenter()
morph_vocab = MorphVocab()

emb = NewsEmbedding()
morph_tagger = NewsMorphTagger(emb)
syntax_parser = NewsSyntaxParser(emb)
ner_tagger = NewsNERTagger(emb)

names_extractor = NamesExtractor(morph_vocab)

###
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict',methods=['POST'])
def predict():

    input_features = [x for x in request.form.values()]
    text = input_features[0]

    doc = Doc(text)
    doc.segment(segmenter)
    doc.tag_morph(morph_tagger)
    doc.tag_ner(ner_tagger)

    lines = format_span_box_markup(text=doc.ner.text, spans=doc.ner.spans)
    html = ''.join(lines)
    return render_template('index.html', prediction_text=html)

@app.route('/results',methods=['POST'])
def results():

    data = request.get_json(force=True)
    text = data["text"]

    doc = Doc(text)
    doc.segment(segmenter)
    doc.tag_morph(morph_tagger)
    doc.tag_ner(ner_tagger)

    spans = []
    for span in doc.spans:
        output_dict = json.loads(json.dumps(span.as_json))
        del output_dict["tokens"]
        spans.append(output_dict)
    return jsonify(text=text, hasBorder=True, spans=spans) 

if __name__ == '__main__':
      app.run(host='83.136.233.81', port=5000)
# if __name__ == "__main__":
#     from waitress import serve
#     serve(app, host="83.136.233.81", port=5050)