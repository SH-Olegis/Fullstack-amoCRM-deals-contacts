export interface Leads {
    name: string;
    budget: string;
    status: string;
    responsible: string;
    date: string;
}

export const columns = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Бюджет',
        dataIndex: 'budget',
        key: 'budget',
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Ответственный',
        dataIndex: 'responsible',
        key: 'responsible',
    },
    {
        title: 'Дата создания',
        dataIndex: 'date',
        key: 'date',
    },
]

export const MIN_CHARS_SEARCH = 3;
export const DEBOUNCE_DELAY = 300;
