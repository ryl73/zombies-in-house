import { Box, IconButton, makeStyles } from '@material-ui/core'
import { ThemeMode, useThemeSwitcher } from '../../theme/ThemeContext'

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'fixed',
    top: 0,
    right: '48px',
  },
  mode: {
    color: 'var(--text-white)',
  },
}))

export const ThemeToggleButton = () => {
  const { mode, setMode } = useThemeSwitcher()
  const classes = useStyles()

  const toggleTheme = () => {
    let nextMode: ThemeMode
    if (mode === 'light') {
      //nextMode = 'dark'
      nextMode = 'halloween'
    } else nextMode = 'light'
    setMode(nextMode)
  }

  return (
    <Box className={classes.wrapper}>
      <IconButton onClick={toggleTheme} size="medium">
        <span className="material-symbols-outlined">
          <span className={classes.mode}>
            {mode === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </span>
      </IconButton>
    </Box>
  )
}
