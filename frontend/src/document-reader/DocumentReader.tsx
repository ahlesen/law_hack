import React from 'react';
import {
    InnerWrapper,
    ParagraphStyled,
    SpinnerWrapper,
    Wrapper
} from './DocumentReader.styles';
import { Spin, Tooltip, Typography } from 'antd';
import { RESULT } from './api-mock-data';
import { Props } from './types';
import { MarkStyled } from '../main-page/main-page.styles';

export const DocumentReader: React.FC<Props> = ({
    result,
    isFetching = RESULT
}) => {
    const formatText = (text: string) => {
        const listOfSymbols = Array.from(text);
        return listOfSymbols.map((item, itemIndex) => {
            // проверяем, есть ли символ, который попадает в начало маркера
            const hasStartMarker = result?.spans.some(
                (item) => item.start === itemIndex
            );

            // если да, возвращаем сразу это слово
            if (hasStartMarker) {
                const part = result?.spans.filter(
                    (item) => item.start === itemIndex
                );
                const word = listOfSymbols
                    .slice(part?.[0].start, part?.[0].stop)
                    .join('');
                return (
                    <>
                        <Tooltip
                            placement="top"
                            title="Здесь можно вывести точность"
                        >
                            <MarkStyled color="yellow">{word}</MarkStyled>;
                        </Tooltip>
                        <Tooltip
                            placement="top"
                            title="Здесь можно вывести точность"
                        >
                            <MarkStyled color="red">{word}</MarkStyled>;
                        </Tooltip>
                        <Tooltip
                            placement="top"
                            title="Здесь можно вывести точность"
                        >
                            <MarkStyled color="green">{word}</MarkStyled>;
                        </Tooltip>
                    </>
                );
            }

            // далее смотрим, относистя ли буква какому-либо спану
            const spansInRange = result?.spans.filter(
                (item) => itemIndex >= item.start && itemIndex < item.stop
            );

            // если нет, то просто возвращаем букву
            if (spansInRange?.length === 0) {
                return item;
            }
        });
    };
    return (
        <Wrapper>
            <Typography>
                <SpinnerWrapper>{isFetching && <Spin />}</SpinnerWrapper>
                <InnerWrapper>
                    <ParagraphStyled hasBorder>
                        {result && formatText(result.text)}
                    </ParagraphStyled>
                    <ParagraphStyled>
                        {result && formatText(result.text)}
                    </ParagraphStyled>
                </InnerWrapper>
            </Typography>
        </Wrapper>
    );
};
