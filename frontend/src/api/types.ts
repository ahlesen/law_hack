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

export interface ResultsResponse {
    hasBorder: boolean;
    spans: Span[];
    text: string;
}
