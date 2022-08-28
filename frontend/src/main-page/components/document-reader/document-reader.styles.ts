import styled, { css } from 'styled-components';
import { Typography } from 'antd';
import { Badge } from 'antd';
const { Paragraph } = Typography;

export const Wrapper = styled.div`
    background-color: white;
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

export const ParagraphStyled = styled(Paragraph)<{
    $isRemovePaddings?: boolean;
}>`
    padding: 20px;
    line-height: 33px;
    position: relative;
    ${(props) =>
        props.$isRemovePaddings
            ? css`
                  padding-top: 0;
                  padding-bottom: 0;
              `
            : css`
                  padding: 20px;
              `};
`;

export const BorderStyled = styled.div`
    position: relative;
    border-radius: 10px;
    border: 1px dashed gray;
    margin-top: 35px;
    margin-bottom: 10px;
`;

export const Span = styled(Badge.Ribbon)`
    position: absolute;
    top: -13px;
`;
