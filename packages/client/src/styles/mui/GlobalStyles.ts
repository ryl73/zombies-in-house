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
}))
