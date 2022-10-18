import { axios } from '~/config'

export const autoSave = (body: Apis.ApiContent.ReqEdit) => axios.post('content', body)
