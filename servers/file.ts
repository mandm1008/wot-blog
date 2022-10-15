import { axios } from '~/config'

export const deleteFile = (body: Apis.ApiFiles.ReqDeleteFiles) => axios.delete('data/files', { data: body })
