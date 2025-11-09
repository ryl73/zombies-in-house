import axios from 'axios'

export const api = axios.create({
  baseURL: `/server/api`, // базовый URL
  withCredentials: true,
})

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error)
  }
)

export default api
