import axios from 'axios'
import { clearUser } from '../slices/userSlice'
import { logout } from './LoginAPI'

const USER_IN_SYSTEM = 'User already in system'

export const apiYandex = axios.create({
  baseURL: 'https://ya-praktikum.tech/api/v2', // базовый URL
  withCredentials: true,
})

apiYandex.interceptors.response.use(
  response => response,
  error => {
    if (typeof window !== 'undefined') {
      if (
        error.response?.status === 401 &&
        window.location.pathname !== '/signin'
      ) {
        // если не авторизован, то делаем редирект на страницу логина
        clearUser()
        window.location.replace('/signin')
      } else if (
        error.response?.status === 400 &&
        error.response?.data.reason === USER_IN_SYSTEM
      ) {
        // делаем выход, если пользователь попал в ловушку "User already in system"
        logout()
      }
    }
    return Promise.reject(error)
  }
)

export default apiYandex
