import { axios } from '~/config'

export const create = (body: Apis.ApiCategory.ReqCreate) => axios.post<Apis.ApiCategory.ResCreate>('category', body)

export const edit = (body: Apis.ApiCategory.ReqEdit) => axios.put<Apis.ApiCategory.ResEdit>('category', body)
