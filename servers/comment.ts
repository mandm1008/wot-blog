import { axios } from '~/config'
import { accessToken } from './user'

export const sendComment = (data: Apis.ApiComment.ReqCreate) =>
  axios.post<Apis.ApiComment.ResCreate>('comments', data, { headers: accessToken })

export const deleteComment = (body: Apis.ApiComment.ReqDelete) =>
  axios.delete('comments', { headers: accessToken, data: body })
