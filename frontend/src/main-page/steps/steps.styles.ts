import styled from 'styled-components';
import { Typography } from 'antd';
const { Paragraph } = Typography;
export const TitleContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;

export const ParagraphStyled = styled(Paragraph)`
    display: flex;
    text-align: center;
`;

export const TitleWrapper = styled.div`
    text-align: center;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
`;

export const ResultsContainer = styled.div`
    max-width: 1280px;
    display: flex;
    margin: 20px auto 0;

    & > .ant-tabs {
        background-color: white;
        width: 100%;
    }
`;

export const StatisticContainer = styled.div`
    display: flex;
    justify-content: center;
`;
