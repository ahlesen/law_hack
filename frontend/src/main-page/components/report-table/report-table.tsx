import { Table } from 'antd';
import React from 'react';
import { getColumns, Source } from '../../util';
import { Wrapper } from './report-table.styles';

interface Props {
    data: Source[];
}

export const ReportTable: React.FC<Props> = ({ data }) => {
    return (
        <Wrapper>
            <Table pagination={false} dataSource={data} columns={getColumns} />
        </Wrapper>
    );
};
