import apiClient from './APIClient'
import { clearUser } from '../slices/userSlice'

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

export type SignUpResponse = {
  id?: number
} & SimpleResponse

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
