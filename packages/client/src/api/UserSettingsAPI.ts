import { ThemeMode } from '../theme/ThemeContext'
import { api } from './API'

export const getUserTheme = async (): Promise<ThemeMode> => {
  const response = await api.get('/user/theme')
  return response.data.theme
}

export const setUserTheme = async (theme: ThemeMode): Promise<void> => {
  await api.post('/user/theme', { theme })
}
