export type Source = {
    key: string;
    class: string;
    subject: string;
    model_confident: string;
};

const dataSource = [
    {
        key: '1',
        class: '1',
        subject: 'Понятия, используемые для',
        model_confident: '60.2'
    },
    {
        key: '2',
        class: '2',
        subject: '...',
        model_confident: 'Отсутствует в документе'
    },
    {
        key: '39',
        class: '39',
        subject: 'Предоставление средств субсидии третьим лицам',
        model_confident: '80.1'
    }
];

const columns = [
    {
        title: 'Класс',
        dataIndex: 'class',
        key: 'class',
        dataSpan: 1
    },
    {
        title: 'Предмет анализа',
        dataIndex: 'subject',
        key: 'subject',
        dataSpan: 1
    },
    {
        title: 'Уверенность модели в классе %',
        dataIndex: 'model_confident',
        key: 'model_confident',
        dataSpan: 1
    }
];

export const getSource = dataSource;
export const getColumns = columns;
