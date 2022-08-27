import styled from 'styled-components';
import { Form } from 'antd';

export const ButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 90%;
    justify-content: end;
    margin-top: 30px;
    gap: 10px;
`;

export const FormWrapper = styled.div`
    margin: 45px;
`;

export const FormItemStyled = styled(Form.Item)`
    width: 45%;
`;
