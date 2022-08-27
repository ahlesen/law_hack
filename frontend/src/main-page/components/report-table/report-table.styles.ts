import styled from 'styled-components';

export const Wrapper = styled.div`
    & > .ant-table-wrapper {
        margin: 10px;
        border: 1px solid #bbbbbb;
    }

    td:nth-child(2) {
        width: 750px;
    }

    td:first-child {
        width: 5px;
    }

    tr:nth-child(odd) {
        background: rgba(243, 243, 243, 0.45);
    }

    tr:hover {
        background: rgba(243, 243, 243, 0.81);
    }
`;
