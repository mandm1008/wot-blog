import axios, { AxiosRequestConfig } from 'axios'
import { server } from './constants'

const instance = axios.create({
  baseURL: server + '/api/',
  timeout: 5000,
  timeoutErrorMessage: 'Network connection timeout!',
  transformRequest: (data) => JSON.stringify(data),
  transformResponse: (data) => {
    let parse

    try {
      parse = JSON.parse(data)
    } catch (e) {
      return { error: 'Error parsing data!' }
    }

    return parse
  },
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  },
  validateStatus: null
})

const api = {
  async get<T>(url: string, config?: AxiosRequestConfig<any>) {
    return instance.get<T & Apis.Error>(url, config).then((res) => res.data)
  },
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return instance.post<T & Apis.Error>(url, data, config).then((res) => res.data)
  },
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return instance.put<T & Apis.Error>(url, data, config).then((res) => res.data)
  },
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig<any>) {
    return instance.patch<T & Apis.Error>(url, data, config).then((res) => res.data)
  },
  async delete<T>(url: string, config?: AxiosRequestConfig<any>) {
    return instance.delete<T & Apis.Error>(url, config).then((res) => res.data)
  }
}

export default api
