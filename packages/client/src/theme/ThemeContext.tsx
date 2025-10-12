import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { darkTheme, lightTheme } from './theme'

type ThemeMode = 'light' | 'dark'

const ThemeContext = createContext<{
  mode: ThemeMode
  toggleTheme: () => void
}>({
  mode: 'dark',
  toggleTheme: () => {
    throw new Error('useThemeSwitcher must be used within ThemeProviderCustom')
  },
})

export const useThemeSwitcher = () => useContext(ThemeContext)

export const ThemeProviderCustom: React.FC<{
  children: React.ReactNode
  initialMode?: ThemeMode
}> = ({ children, initialMode = 'dark' }) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode)

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null
    if (saved) {
      setMode(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
