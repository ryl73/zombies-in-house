import { apiYandex } from './APIYandex'
import { setUser, User } from '../slices/userSlice'
import { SimpleResponse } from './LoginAPI'

export type UserResponse = {
  id: number
  first_name: string
  second_name: string
  display_name: string
  phone: string
  login: string
  avatar: string
  email: string
} & SimpleResponse

export type ChangeUserRequest = {
  first_name: string
  second_name: string
  display_name: string
  login: string
  email: string
  phone: string
}

export type ChangePasswordRequest = {
  oldPassword: string
  newPassword: string
}

const mapUserResponseToUser = (response: UserResponse): User => ({
  id: response.id,
  firstName: response.first_name,
  secondName: response.second_name,
  displayName: response.display_name,
  login: response.login,
  email: response.email,
  phone: response.phone,
  avatar: response.avatar,
})

export const getUser = async (): Promise<User> => {
  const response = await apiYandex.get<UserResponse>('/auth/user')
  const user: User = mapUserResponseToUser(response.data)
  setUser(user)
  return user
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<SimpleResponse> => {
  const response = await apiYandex.put<SimpleResponse>('/user/password', data)
  return response.data
}

export const changeUser = async (data: ChangeUserRequest): Promise<User> => {
  const response = await apiYandex.put<UserResponse>('/user/profile', data)
  const user: User = mapUserResponseToUser(response.data)
  setUser(user)
  return user
}

export const changeAvatar = async (data: FormData): Promise<User> => {
  const response = await apiYandex.put<UserResponse>(
    '/user/profile/avatar',
    data
  )
  const user: User = mapUserResponseToUser(response.data)
  setUser(user)
  return user
}
