import { axios } from '~/config'

export const create = (body: Apis.ApiEmail.ReqCreate) => axios.post<Apis.ApiEmail.ResCreate>('emails', body)

export const edit = (body: Apis.ApiEmail.ReqEdit) => axios.patch('emails', body)

export const send = (_id: string) => axios.get(`emails?_id=${_id}`)

export const copy = (body: Apis.ApiEmail.ReqCopy) => axios.put<Apis.ApiEmail.ResCopy>('emails', body)
