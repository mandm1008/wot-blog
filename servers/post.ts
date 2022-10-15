import { axios } from '~/config'

export const counter = ({ type, id, idUser }: Apis.ApiPost.ReqInteractive) =>
  axios.get(idUser ? `posts?type=${type}&id=${id}&idUser=${idUser}` : `posts?type=${type}&id=${id}`)

export const create = (body: Apis.ApiPost.ReqCreate) => axios.post<Apis.ApiPost.ResCreate>('posts', body)

export const autoSave = (body: Apis.ApiContent.ReqEdit) => axios.post('content', body)

export const edit = (body: Apis.ApiPost.ReqEdit) => axios.patch<Apis.ApiPost.ResEdit>('posts', body)
