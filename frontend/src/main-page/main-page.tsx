import React, { useEffect } from 'react';
import { FirstStepWrapper, Main, TabsContainer } from './main-page.styles';
import { SecondStep, FirstStep } from './steps';
import { useResults } from './use-results';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
interface Props {}

export const MainPage: React.FC<Props> = () => {
    const { model1, model2, setResults } = useResults();

    useEffect(() => {
        if (model1.okBlock && document !== undefined) {
            document
                .getElementById('id')
                ?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [model1]);

    return (
        <Main>
            <FirstStepWrapper>
                <FirstStep onUpload={setResults} />
            </FirstStepWrapper>
            <div id="id">
                {model1.okBlock && model2.okBlock && (
                    <TabsContainer>
                        <Tabs centered>
                            <TabPane tab="Модель 1" key="1">
                                <SecondStep
                                    isShow={true}
                                    reportData={model1.results}
                                    okayBlockData={model1.okBlock}
                                    analyseData={model1.analysis}
                                />
                            </TabPane>
                            <TabPane tab="Модель 2" key="2">
                                <SecondStep
                                    isShow={true}
                                    reportData={model2.results}
                                    okayBlockData={model2.okBlock}
                                    analyseData={model2.analysis}
                                />
                            </TabPane>
                        </Tabs>
                    </TabsContainer>
                )}
            </div>
        </Main>
    );
};
