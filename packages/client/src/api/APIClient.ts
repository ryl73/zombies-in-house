import axios from 'axios'

const USER_IN_SYSTEM = 'User already in system'

export const apiClient = axios.create({
  baseURL: 'https://ya-praktikum.tech/api/v2', // базовый URL
  withCredentials: true,
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/signin'
    ) {
      // если не авторизован, то делаем редирект на страницу логина
      localStorage.removeItem('isAuthenticated')
      window.location.replace('/signin')
    } else if (
      error.response?.status === 400 &&
      error.response?.data.reason === USER_IN_SYSTEM
    ) {
      localStorage.setItem('isAuthenticated', 'true')
      window.location.replace('/')
    }
    return Promise.reject(error)
  }
)

export default apiClient
