import apiClient from './APIClient'

export interface SignInRequest {
  login: string
  password: string
}

export interface SignInResponse {
  reason: string
}

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await apiClient.post<SignInResponse>('/auth/signin', data)
  if (response.status >= 200 && response.status < 300)
    localStorage.setItem('isAuthenticated', 'true')
  return response.data
}

export const logout = async (): Promise<SignInResponse> => {
  const response = await apiClient.post<SignInResponse>('/auth/logout')
  localStorage.removeItem('isAuthenticated')
  return response.data
}
