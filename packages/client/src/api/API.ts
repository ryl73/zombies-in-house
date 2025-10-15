import axios from 'axios'

export const api = axios.create({
  baseURL: `/api`, // базовый URL
})

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error)
  }
)

export default api
