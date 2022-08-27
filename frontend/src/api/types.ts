export interface FormFields {
    text: string;
    doc: any;
}

type Span = {
    start: number;
    stop: number;
    text: string;
    type: string;
};

type SpanNew = {
    start: number;
    end: number;
    type: string;
};

export interface ResultsResponse {
    hasBorder: boolean;
    spans: Span[];
    text: string;
}

export type Analysis = {
    class: string;
    spans: SpanNew[];
    text: string;
    proba: number;
};

export type OkBlock = {
    ok: true;
    percent: number;
};

export type Report = {
    class_name: number[];
    model_confident: string[];
    subject: string[];
};

export type Content = {
    // вкладка "Анализ"
    doc_analysis: Analysis[];
    // блок с результатом (числа)
    doc_ok: OkBlock;
    // блок "Отчет"
    doc_report: Report;
};

// сырые данные с сервера
export interface ProcessResponse {
    model1: Content;
    model2: Content;
}
