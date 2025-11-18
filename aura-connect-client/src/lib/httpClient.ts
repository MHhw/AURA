import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios, { AxiosHeaders } from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')

    if (token) {
      const headers =
        typeof config.headers?.set === 'function'
          ? config.headers
          : new AxiosHeaders(config.headers)

      headers.set('Authorization', `Bearer ${token}`)
      config.headers = headers
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request detected. Consider refreshing credentials.')
    }

    return Promise.reject(error)
  },
)

export default httpClient
