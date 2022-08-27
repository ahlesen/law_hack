import React, { useState } from 'react';
import { Button, Form, Input, UploadProps } from 'antd';
import { ButtonsWrapper, FormItemStyled, FormWrapper } from './Home.styles';
import { DocumentReader } from '../document-reader';
import { TEXT_MOCK } from '../constants';
import { FormFields, ResultsResponse } from '../api/types';
import { sendText } from '../api';
import { message } from 'antd';
const { TextArea } = Input;

export const Home = () => {
    const [mode, setMode] = useState<'edit' | 'read'>('edit');
    const [result, setResult] = useState<ResultsResponse>();
    const [isFetching, setIsFetching] = useState(false);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values: FormFields) => {
        try {
            setIsFetching(true);
            const results = await sendText(values.text);
            results && setResult(results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsFetching(false);
        }
    };

    const handleClear = () => {
        setMode('edit');
        setResult(undefined);
    };

    return (
        <FormWrapper>
            <Form
                layout="inline"
                name="basic"
                onFinish={onFinish}
                initialValues={{
                    text: TEXT_MOCK
                }}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {/*<Form.Item*/}
                {/*    name="upload"*/}
                {/*    label="Upload"*/}
                {/*    valuePropName="fileList"*/}
                {/*    getValueFromEvent={normFile}*/}
                {/*    extra="longgggggggggggggggggggggggggggggggggg"*/}
                {/*>*/}
                {/*    <Upload {...props}>*/}
                {/*        <Button icon={<UploadOutlined />}>*/}
                {/*            Click to Upload*/}
                {/*        </Button>*/}
                {/*    </Upload>*/}
                {/*</Form.Item>*/}

                <FormItemStyled
                    name="text"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, заполните поле!'
                        }
                    ]}
                >
                    {mode === 'edit' && (
                        <TextArea
                            showCount
                            style={{ height: 500 }}
                            placeholder="Начните вводить текст"
                        />
                    )}
                </FormItemStyled>

                <FormItemStyled name="targetText">
                    <DocumentReader result={result} isFetching={isFetching} />
                </FormItemStyled>
                <ButtonsWrapper>
                    <Button onClick={handleClear}>Сбросить</Button>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </ButtonsWrapper>
            </Form>
        </FormWrapper>
    );
};
