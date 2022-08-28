import styled from 'styled-components';

export const Main = styled.div`
    margin: 10px 50px 1px;
`;

export const DocumentContainer = styled.div`
    margin-top: 10px;
`;

export const StatisticContainer = styled.div`
    margin: 10px;
`;

export const MarkStyled = styled.div<{ color: string }>`
    display: inline;
    background-color: ${(props) => props.color};
`;

export const FirstStepWrapper = styled.div`
    display: flex;

    @media print {
        display: none;
    }
`;

export const TabsContainer = styled.div`
    margin-top: 50px;
    background: white;
`;
