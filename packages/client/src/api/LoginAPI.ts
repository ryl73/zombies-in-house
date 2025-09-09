import apiClient from './APIClient'

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

export type UserResponse = {
  id: number
  first_name: string
  second_name: string
  display_name: string
  phone: string
  login: string
  avatar: string
  email: string
}

export const signIn = async (data: SignInRequest): Promise<SimpleResponse> => {
  const response = await apiClient.post<SimpleResponse>('/auth/signin', data)
  localStorage.setItem('isAuthenticated', 'true')
  return response.data
}

export const logout = async (): Promise<SimpleResponse> => {
  const response = await apiClient.post<SimpleResponse>('/auth/logout')
  localStorage.removeItem('isAuthenticated')
  return response.data
}

export const signup = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await apiClient.post<SignUpResponse>('/auth/signup', data)
  localStorage.setItem('isAuthenticated', 'true')
  return response.data
}

export const getUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/auth/user')
  return response.data
}
