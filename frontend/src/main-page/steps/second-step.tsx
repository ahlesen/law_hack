import React from 'react';
import { Empty, Tabs } from 'antd';
import { ResultsContainer, StatisticContainer } from './steps.styles';
import { DocumentContainer } from '../main-page.styles';
import { ReportTable } from '../components';
import {
    CheckCircleTwoTone,
    ExclamationCircleTwoTone
} from '@ant-design/icons';
import { Statistic } from 'antd';
import { Source } from '../util';
import { Analysis, OkBlock } from '../../api';
import { DocumentReader } from '../components';

const { TabPane } = Tabs;

interface Props {
    isShow: boolean;
    reportData: Source[];
    okayBlockData?: OkBlock;
    analyseData?: Analysis[];
}
export const SecondStep: React.FC<Props> = ({
    isShow,
    reportData,
    okayBlockData,
    analyseData
}) => {
    if (!isShow) {
        return null;
    }
    const onChange = (key: string) => {
    };
    return (
        <>
            <StatisticContainer>
                {okayBlockData && (
                    <Statistic
                        title={'Полнота документа'}
                        value={`${okayBlockData.percent} %`}
                        suffix={
                            okayBlockData.ok ? (
                                <CheckCircleTwoTone />
                            ) : (
                                <ExclamationCircleTwoTone />
                            )
                        }
                    />
                )}
            </StatisticContainer>
            <ResultsContainer>
                <Tabs onChange={onChange} centered>
                    <TabPane tab="Отчёт" key="1">
                        <DocumentContainer>
                            <ReportTable data={reportData} />
                        </DocumentContainer>
                    </TabPane>
                    <TabPane tab="Анализ документа" key="2">
                        <DocumentContainer>
                            {!analyseData && (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                            <DocumentReader
                                isFetching={false}
                                analys={analyseData}
                            />
                        </DocumentContainer>
                    </TabPane>
                </Tabs>
            </ResultsContainer>
        </>
    );
};
