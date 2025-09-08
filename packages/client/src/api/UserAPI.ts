import apiClient from './APIClient'
import { setUser } from '../slices/userSlice'
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

export const getUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/auth/user')
  setUser(response.data)
  return response.data
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<SimpleResponse> => {
  const response = await apiClient.put<SimpleResponse>('/user/password', data)
  return response.data
}

export const changeUser = async (
  data: ChangeUserRequest
): Promise<UserResponse> => {
  const response = await apiClient.put<UserResponse>('/user/profile', data)
  setUser(response.data)
  return response.data
}

export const changeAvatar = async (data: FormData): Promise<UserResponse> => {
  const response = await apiClient.put<UserResponse>(
    '/user/profile/avatar',
    data
  )
  setUser(response.data)
  return response.data
}
