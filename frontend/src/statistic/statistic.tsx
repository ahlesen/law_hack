import React, { FC } from 'react';
import { Modal } from 'antd';

interface Props {
    isShow: boolean;
    handleClose: () => void;
}

export const Statistic: FC<Props> = ({ isShow, handleClose }) => {
    return (
        <Modal visible={isShow} onOk={handleClose} onCancel={handleClose}>
            <div>Текст статистики</div>
        </Modal>
    );
};
