import { axios } from '~/config'

export const deleteImage = (body: Apis.ApiImages.ReqDeleteImages) => axios.delete('data/images', { data: body })
