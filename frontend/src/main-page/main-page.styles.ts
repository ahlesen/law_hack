import styled from 'styled-components';

export const Main = styled.div`
    margin: 10px 50px 50px;
    margin-bottom: 1px;
`;

export const DocumentContainer = styled.div`
    margin-top: 10px;
`;

export const StatisticContainer = styled.div`
    margin: 10px;
`;

const colors = {
    red: '#ff8e8e',
    yellow: '#ffe88e',
    green: '#99ff95'
};

export const MarkStyled = styled.div<{ color: 'red' | 'green' | 'yellow' }>`
    display: inline;
    background-color: ${(props) => colors[props.color]};
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
