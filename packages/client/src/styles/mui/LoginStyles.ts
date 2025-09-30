import { makeStyles } from '@material-ui/core'

export const useLoginStyles = makeStyles(theme => ({
  root: {
    '& .MuiButton-root': {
      margin: '0',
    },
  },
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themedHeader: {
    marginBottom: theme.spacing(3.75),
  },
  form: {
    marginBottom: theme.spacing(2),
  },
}))
