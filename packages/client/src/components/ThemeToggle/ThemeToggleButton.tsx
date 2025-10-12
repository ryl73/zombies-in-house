import { Button, makeStyles } from '@material-ui/core'
import { useThemeSwitcher } from '../../theme/ThemeContext'

const useStyles = makeStyles(theme => ({
  button: {
    position: 'fixed',
    top: 0,
    right: '48px',
  },
}))

export const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeSwitcher()
  const classes = useStyles()

  return (
    <Button
      onClick={toggleTheme}
      variant="contained"
      color="primary"
      className={classes.button}>
      Переключить тему
    </Button>
  )
}
