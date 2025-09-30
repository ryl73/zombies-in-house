import { makeStyles } from '@material-ui/core'

export const useGlobalStyles = makeStyles(theme => ({
  mainBtn: {
    width: '100%',
    maxWidth: '435px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    whiteSpace: 'nowrap',
  },
  themedHeader: {
    fontFamily: 'Rubik Wet Paint, cursive',
    textAlign: 'center',
    color: 'var(--color-primary)',
    fontSize: '64px',
    lineHeight: '64px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },
}))
