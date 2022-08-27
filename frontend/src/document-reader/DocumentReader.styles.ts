import styled, { css } from 'styled-components';
import { Typography } from 'antd';
const { Paragraph } = Typography;

export const Wrapper = styled.div`
    background-color: white;
    max-height: 500px;
    overflow: scroll;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    position: relative;
`;

export const InnerWrapper = styled.div`
    margin-right: 10px;
    padding: 4px 11px;
    min-height: 500px;
`;

export const SpinnerWrapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ParagraphStyled = styled(Paragraph)<{ hasBorder?: boolean }>`
    padding: 20px;
    border-radius: 10px;
    line-height: 33px;
    margin-top: 20px;
    position: relative;

    ${(props) =>
        props.hasBorder &&
        css`
            border: 1px dashed gray;

            &:after {
                position: absolute;
                content: 'Текст классификации абзаца';
                top: -25px;
                left: 0;
                font-size: 11px;
            }
        `}
`;
