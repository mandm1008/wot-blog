import { axios } from '~/config'

export const tableAction = ({ path, action }: { path: string; action: string }, body: Apis.ApiDelete.ReqBody) =>
  axios.delete<Apis.ApiDelete.Res>(`${path}?type=${action}`, { data: body })
