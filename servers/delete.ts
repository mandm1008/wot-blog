import { axios } from '~/config'

export const tableAction = ({ path, action }: { path: string; action: string }, body: Apis.ApiPost.ReqDeleteBody) =>
  axios.delete<Apis.ApiPost.ResDelete>(`${path}?type=${action}`, { data: body })
