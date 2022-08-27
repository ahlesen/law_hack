import React from 'react';
import {
    BorderStyled,
    InnerWrapper,
    ParagraphStyled,
    Span,
    SpinnerWrapper,
    Wrapper
} from './document-reader.styles';
import { Spin, Typography } from 'antd';
import { RESULT } from './api-mock-data';
import { MarkStyled } from '../../main-page.styles';
import { Analysis } from '../../../api';

export interface Props {
    analys?: Analysis[];
    isFetching: boolean;
}

export const DocumentReader: React.FC<Props> = ({
    analys,
    isFetching = RESULT
}) => {
    if (!analys) return null;

    const formatText = (text: string, index: number) => {
        const listOfSymbols = Array.from(text);
        // eslint-disable-next-line array-callback-return
        return listOfSymbols.map((item, itemIndex) => {
            // проверяем, есть ли символ, который попадает в начало маркера
            const hasStartMarker = analys[index].spans.some(
                (item) => item.start === itemIndex
            );

            // если да, возвращаем сразу это слово
            if (hasStartMarker) {
                const part = analys[index].spans.filter(
                    (item) => item.start === itemIndex
                );
                const word = listOfSymbols
                    .slice(part?.[0].start, part?.[0].end)
                    .join('');
                return <MarkStyled color="red">{word}</MarkStyled>;
            }

            // далее смотрим, относистя ли буква какому-либо спану
            const spansInRange = analys[index].spans.filter(
                (item) => itemIndex >= item.start && itemIndex < item.end
            );

            // если нет, то просто возвращаем букву
            if (spansInRange?.length === 0) {
                return item;
            }
        });
    };
    const getColor = (number: number) => {
        if (number >= 50 && number < 70) {
            return 'gold';
        }

        if (number >= 70) {
            return 'green';
        }

        if (number < 50) {
            return 'red';
        }
    };
    return (
        <Wrapper>
            <Typography>
                <SpinnerWrapper>{isFetching && <Spin />}</SpinnerWrapper>
                <InnerWrapper>
                    {analys.map((item, index) => {
                        const paragraph = (
                            <ParagraphStyled
                                key={index}
                                isRemovePaddings={item.class === '0'}
                            >
                                {formatText(item.text, index)}
                            </ParagraphStyled>
                        );

                        // нет описания
                        if (item.class === '0') {
                            return paragraph;
                        }

                        return (
                            <BorderStyled>
                                <Span
                                    text={item.class}
                                    color={getColor(item.proba || 1)}
                                    placement={'start'}
                                />
                                {paragraph}
                            </BorderStyled>
                        );
                    })}
                </InnerWrapper>
            </Typography>
        </Wrapper>
    );
};
