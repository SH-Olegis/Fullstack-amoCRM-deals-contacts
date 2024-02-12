interface CustomFieldsValues {
  field_name: string
  value: string
}

interface Contact {
  id: number
  name: string
  custom_fields_values: CustomFieldsValues[]
}

interface User {
  id: number
  name: string
  email: string
}

interface Status {
  id: number
  name: string
  color: string
}

export interface Lead {
  id: number
  name: string
  price: number
  created_at: string
  contacts_ids: number[] | null
  responsible_user_id: number
  status_id: number
  contacts: Contact[] | null
  responsible_user: User
  status: Status
}

type KeyLeads = keyof Lead

interface IColumns<T extends KeyLeads> {
  title: string
  dataIndex: T
  key: T
}

export const columns: IColumns<KeyLeads>[] = [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Бюджет',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Ответственный',
    dataIndex: 'responsible_user',
    key: 'responsible_user'
  },
  {
    title: 'Дата создания',
    dataIndex: 'created_at',
    key: 'created_at'
  }
]

export const MIN_CHARS_SEARCH = 3
export const DEBOUNCE_DELAY = 300
