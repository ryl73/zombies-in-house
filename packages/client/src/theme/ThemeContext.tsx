import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { darkTheme, lightTheme, halloweenTheme } from './theme'
import { themeManager } from './ThemeManager'

export type ThemeMode = 'light' | 'dark' | 'halloween'

const ThemeContext = createContext<{
  mode: ThemeMode
  toggleTheme: () => void
}>({
  // mode: 'dark',
  mode: 'halloween',
  toggleTheme: () => {
    throw new Error('useThemeSwitcher must be used within ThemeProviderCustom')
  },
})

export const useThemeSwitcher = () => useContext(ThemeContext)

// const providerInitialMode = 'dark'
const providerInitialMode = 'halloween'

export const ThemeProviderCustom: React.FC<{
  children: React.ReactNode
  initialMode?: ThemeMode
}> = ({ children, initialMode = providerInitialMode }) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode)

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null
    if (saved) {
      setMode(saved)
      themeManager.setMode(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', mode)
    themeManager.setMode(mode)
  }, [mode])

  const toggleTheme = () => {
    // const nextMode = mode === 'dark' ? 'light' : 'dark'
    const nextMode = mode === 'halloween' ? 'light' : 'halloween'
    setMode(nextMode)
    themeManager.setMode(nextMode)
  }

  // const muiTheme = mode === 'dark' ? darkTheme : lightTheme
  const muiTheme = mode === 'halloween' ? halloweenTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
