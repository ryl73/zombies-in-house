import { ThemeMode } from '../theme/ThemeContext'
import { api } from './API'

export const getUserTheme = async (userId: number): Promise<ThemeMode> => {
  const response = await api.get<{ theme: ThemeMode }>('/user/theme', {
    params: { userId },
  })
  return response.data.theme
}

export const setUserTheme = async (
  userId: number,
  theme: ThemeMode
): Promise<void> => {
  await api.post('/user/theme', { userId, theme })
}
