import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

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
