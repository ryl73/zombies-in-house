import apiClient from './APIClient'
import { setUser, clearUser } from '../slices/userSlice'

export type SimpleResponse = {
  response?: string
}

export type SignInRequest = {
  login: string
  password: string
}

export type SignUpRequest = {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export type ChangePasswordRequest = {
  oldPassword: string
  newPassword: string
}

export type SignUpResponse = {
  id?: number
} & SimpleResponse

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

export const signIn = async (data: SignInRequest): Promise<SimpleResponse> => {
  const response = await apiClient.post<SimpleResponse>('/auth/signin', data)
  return response.data
}

export const logout = async (): Promise<SimpleResponse> => {
  const response = await apiClient.post<SimpleResponse>('/auth/logout')
  clearUser()
  return response.data
}

export const signup = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await apiClient.post<SignUpResponse>('/auth/signup', data)
  return response.data
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
