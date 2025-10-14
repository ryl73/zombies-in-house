import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { darkTheme, lightTheme, halloweenTheme } from './theme'

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

export const ThemeProviderCustom: React.FC<{
  children: React.ReactNode
  initialMode?: ThemeMode
  // change initialMode to 'dark' mode
}> = ({ children, initialMode = 'halloween' }) => {
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
    // setMode(prev => (prev === 'dark' ? 'light' : 'dark'))
    setMode(prev => (prev === 'halloween' ? 'light' : 'halloween'))
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {/* change to 'dark' mode and 'darkTheme' */}
      <ThemeProvider theme={mode === 'halloween' ? halloweenTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
