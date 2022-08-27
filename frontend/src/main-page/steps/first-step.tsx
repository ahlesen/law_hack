import { message, Typography, Upload, UploadProps } from 'antd';
import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import {
    Container,
    ParagraphStyled,
    TitleContainer,
    TitleWrapper
} from './steps.styles';
import { ProcessResponse } from '../../api';
import type { RcFile } from 'antd/es/upload/interface';
const { Dragger } = Upload;
const { Title } = Typography;

interface FirstStepProps {
    onUpload: (data: ProcessResponse) => void;
}

export const FirstStep: React.FC<FirstStepProps> = ({ onUpload }) => {
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        action: 'http://83.136.233.81:5000',
        beforeUpload: (file: RcFile) => {
            const format = file.name.split('.')[1];
            const isDocOrDocx = format === 'doc' || format === 'docx';

            if (!isDocOrDocx) {
                message.error('You can only upload doc/docx file!');
            }

            return isDocOrDocx;
        },
        onChange(info) {
            const { status, name } = info.file;
            const format = name.split('.')[1];
            const isDocOrDocx = format === 'doc' || format === 'docx';

            if (!isDocOrDocx) {
                return;
            }

            if (status === 'done') {
                onUpload(info.file.response);
                message.success(`${info.file.name} — загружен успешно!`);
            } else if (status === 'error') {
                message.error(`${info.file.name} — ошибка загрузки`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    return (
        <Container>
            <TitleContainer>
                <TitleWrapper>
                    <Title>Юридический помощник для проверки НПА</Title>
                </TitleWrapper>
                <ParagraphStyled>
                    Загрузите документ НПА в формате DOCX и DOC для его анализа
                    на предмет соответствия основным требованиям, а также для
                    выявления в нём ошибок и неточностей
                </ParagraphStyled>
            </TitleContainer>
            <Dragger {...uploadProps} maxCount={1}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Кликните или переместите файл для загрузки
                </p>
                <p className="ant-upload-hint">Поддерживаются файлы *.docx</p>
            </Dragger>
        </Container>
    );
};
