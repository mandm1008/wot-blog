import { axios } from '~/config'

export const get = () => axios.get<Apis.ApiTime.Get>('data/time')
