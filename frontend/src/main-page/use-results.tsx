import { useState } from 'react';
import { Analysis, OkBlock, ProcessResponse } from '../api';
import { Source } from './util';

export const useResults = () => {
    // стейт приложения. модель 1:
    const [results, setResults] = useState<Source[]>([]);
    const [okBlock, setOkBlock] = useState<OkBlock | undefined>();
    const [analysis, setAnalysis] = useState<Analysis[] | undefined>();

    // стейт приложения. модель 2:
    const [results2, setResults2] = useState<Source[]>([]);
    const [okBlock2, setOkBlock2] = useState<OkBlock | undefined>();
    const [analysis2, setAnalysis2] = useState<Analysis[] | undefined>();

    const handleProcessResults = (data: ProcessResponse) => {
        const computedSourceSet: Source[] =
            data.model1.doc_report.class_name.map((item, index) => {
                return {
                    key: index.toString(),
                    class: item.toString(),
                    subject: data.model1.doc_report.subject[index],
                    model_confident:
                        data.model1.doc_report.model_confident[index]
                };
            });

        setOkBlock(data.model1.doc_ok);
        setResults(computedSourceSet);
        setAnalysis(data.model1.doc_analysis);

        const computedSourceSet2: Source[] =
            data.model1.doc_report.class_name.map((item, index) => {
                return {
                    key: index.toString(),
                    class: item.toString(),
                    subject: data.model2.doc_report.subject[index],
                    model_confident:
                        data.model2.doc_report.model_confident[index]
                };
            });

        setOkBlock2(data.model2.doc_ok);
        setResults2(computedSourceSet2);
        setAnalysis2(data.model2.doc_analysis);
    };

    return {
        setResults: handleProcessResults,
        model1: {
            results: results,
            okBlock,
            analysis
        },
        model2: {
            results: results2,
            okBlock: okBlock2,
            analysis: analysis2
        }
    };
};
