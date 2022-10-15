import { axios } from '~/config'
import { isServer } from '~/config/constants'

export const accessToken = {
  token: 'Bearer ' + (isServer ? 'cookieAdmin' : localStorage.getItem('accountToken') || 'cookieAdmin')
}

export const login = (data: Apis.ApiUser.ReqLogin) => axios.post<Apis.ApiUser.ResLogin>('users/login', data)

export const loginGoogle = (body: any) => axios.post<Apis.ApiUser.ResLogin>('users/google', body)

export const logout = () => axios.get<string>('users/logout')

export const register = (data: Apis.ApiUser.ReqCreate) => axios.post<Apis.ApiUser.ResCreate>('users/create', data)

export const resetPassword = (data: Apis.ApiUser.ReqResetPassword) =>
  axios.post<Apis.ApiUser.ReqResetPassword>('users/reset-password', data)

export const resetPasswordAction = (data: Apis.ApiUser.ReqResetPasswordActions) =>
  axios.post<Apis.Error>('users/reset-password/actions', data)

export const get = () => axios.get<Apis.ApiUser.ResGet>('users/get', { headers: accessToken })

export const active = (email: string) => axios.get('users/active?email=' + encodeURIComponent(email))

export const edit = (body: Apis.ApiUser.ReqEdit) =>
  axios.post<Apis.ApiUser.ResEdit>('users/edit', body, { headers: accessToken })
