import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Layout } from 'antd';
import 'antd/dist/antd.min.css';
import { MainPage } from './main-page';
const { Header, Content } = Layout;
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Layout>
            <Header>
                <div style={{ color: 'white' }}>
                    <b>SibDS</b>
                </div>
            </Header>
            <Content>
                <MainPage />
            </Content>
        </Layout>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
