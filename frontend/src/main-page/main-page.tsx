import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';
import {
    Main,
    DocumentContainer,
    StatisticContainer
} from './main-page.styles';
import { DocumentReader } from '../document-reader';
import { RESULT } from '../document-reader/api-mock-data';
import { Statistic } from '../statistic';
const { Dragger } = Upload;

interface Props {}

export const MainPage: React.FC<Props> = () => {
    const [isShow, setIsShow] = useState(false);
    const [isOpenStatistic, setIsOpenStatistic] = useState(false);
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                setIsShow(true);
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    return (
        <Main>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Кликните или переместите файл для загрузки
                </p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other band files
                </p>
            </Dragger>
            {isShow && (
                <>
                    <StatisticContainer>
                        <Button onClick={() => setIsOpenStatistic(true)}>
                            Статистика
                        </Button>
                        <Statistic
                            isShow={isOpenStatistic}
                            handleClose={() => setIsOpenStatistic(false)}
                        />
                    </StatisticContainer>
                    <DocumentContainer>
                        <DocumentReader isFetching={false} result={RESULT} />
                    </DocumentContainer>
                </>
            )}
        </Main>
    );
};
