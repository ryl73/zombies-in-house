import { makeStyles } from '@material-ui/core'
import landing from '../../assets/landing-first-screen.webp'

export const useGameStatusStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.background.default,
  },
  header: {
    fontSize: 72,
    [theme.breakpoints.up('sm')]: {
      fontSize: 96,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 120,
    },
  },
  statusHeader: {
    fontSize: 36,
    [theme.breakpoints.up('sm')]: {
      fontSize: 48,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 60,
    },
  },
  firstScreen: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${landing})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(4px)',
      zIndex: 1,
    },
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '4rem',
    minWidth: 360,
    maxWidth: 800,
    zIndex: 2,
  },
}))
