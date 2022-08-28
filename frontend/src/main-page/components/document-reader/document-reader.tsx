import React from 'react';
import {
    BorderStyled,
    InnerWrapper,
    ParagraphStyled,
    Span,
    SpinnerWrapper,
    Wrapper
} from './document-reader.styles';
import { Spin, Tooltip, Typography } from 'antd';
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

    // подсветка цветов
    const getHightLightBackground = (value: number) => {
        //value>0.2 - теплый яркий
        if (value > 0.2) {
            return 'rgb(255,192,137)';
        }
        // 0.2>=value>0.15 - теплый еще ярче
        if (0.2 >= value && value > 0.15) {
            return 'rgba(255,192,137,0.8)';
        }

        // 0.15>=value>0.1 - теплый чуть ярче
        if (0.15 >= value && value > 0.1) {
            return 'rgba(255,192,137,0.58)';
        }

        // 0.1>=value>0 - теплый совсем нежный
        if (0.1 >= value && value > 0) {
            return 'rgba(255,192,137,0.3)';
        }

        // 0.0>=value>-0.1 - холодный совсем нежный
        if (0 >= value && value > -0.1) {
            return 'rgba(0,187,255,0.2)';
        }

        // -0.1>=value>-0.15 - холодный чуть ярче
        if (-0.1 >= value && value > -0.15) {
            return 'rgba(0,187,255,0.64)';
        }

        // -0.15>=value>-0.2 - холодный еще ярче
        if (-0.15 >= value && value > -0.2) {
            return 'rgba(0,187,255,0.84)';
        }

        // -0.2>=value - холодный яркий
        if (-0.2 >= value) {
            return '#00bbff';
        }
    };

    const formatText = (text: string, index: number, aItem: Analysis) => {
        const listOfSymbols = Array.from(text);
        // eslint-disable-next-line array-callback-return
        return listOfSymbols.map((item, itemIndex) => {
            // проверяем, есть ли символ, который попадает в начало маркера
            const hasStartMarker = aItem.spans.some(
                (item) => item.start === itemIndex
            );
            // если да, возвращаем сразу это слово
            if (hasStartMarker) {
                const part = aItem.spans.filter(
                    (item) => item.start === itemIndex
                );

                const word = listOfSymbols
                    .slice(part?.[0].start, part?.[0].end)
                    .join('');
                return (
                    <MarkStyled
                        color={getHightLightBackground(part?.[0].value) as any}
                    >
                        <Tooltip placement="top" title={part?.[0].value}>
                            {word}
                        </Tooltip>
                    </MarkStyled>
                );
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
                                {formatText(item.text, index, item)}
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
                                    color={getColor(item.proba)}
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
