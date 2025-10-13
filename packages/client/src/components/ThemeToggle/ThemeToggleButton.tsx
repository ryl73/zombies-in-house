import { Box, IconButton, makeStyles } from '@material-ui/core'
import { useThemeSwitcher } from '../../theme/ThemeContext'

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
  const { mode, toggleTheme } = useThemeSwitcher()
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <IconButton onClick={toggleTheme} size="medium">
        <span className="material-symbols-outlined">
          <span className={classes.mode}>
            {/* {mode === 'dark' ? 'light_mode' : 'dark_mode'} */}
            {mode === 'halloween' ? 'light_mode' : 'dark_mode'}
          </span>
        </span>
      </IconButton>
    </Box>
  )
}
