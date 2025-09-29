import { makeStyles } from '@material-ui/core'

export const useLoginStyles = makeStyles(theme => ({
  root: {
    '& .MuiButton-root': {
      margin: '0',
    },
  },
  pageContainer: {
    minHeight: '100vh',
    minWidth: 360,
    maxWidth: 800,
    margin: '0 auto',
    backgroundColor: 'var(--color-bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themedHeader: {
    fontFamily: 'Rubik Wet Paint, cursive',
    textAlign: 'center',
    color: 'var(--color-primary)',
    fontSize: '64px',
    lineHeight: '64px',
    marginBottom: theme.spacing(3.75),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}))
