import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { darkTheme, lightTheme, halloweenTheme } from './theme'
import { themeManager } from './ThemeManager'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import { selectTheme, updateUserTheme } from '../slices/themeSlice'
import { selectUser } from '../slices/userSlice'

export type ThemeMode = 'light' | 'dark' | 'halloween'

const ThemeContext = createContext<{
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}>({
  // mode: 'dark',
  mode: 'halloween',
  setMode: (mode: ThemeMode) => {
    throw new Error('useThemeSwitcher must be used within ThemeProviderCustom')
  },
})

export const useThemeSwitcher = () => useContext(ThemeContext)

export const ThemeProviderCustom: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  const user = useAppSelector(selectUser)

  useEffect(() => {
    if (theme) {
      localStorage.setItem('theme', theme)
      themeManager.setMode(theme)
    }
  }, [theme])

  const setMode = (mode: ThemeMode) => {
    themeManager.setMode(mode)
    localStorage.setItem('theme', mode)
    if (user?.id) {
      dispatch(updateUserTheme(mode))
    }
  }

  // const muiTheme = mode === 'dark' ? darkTheme : lightTheme
  const muiTheme = theme === 'halloween' ? halloweenTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ mode: theme, setMode }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
