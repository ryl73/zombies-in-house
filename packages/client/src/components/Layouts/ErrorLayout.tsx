import { Box, Typography, Button } from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowBack } from '@material-ui/icons'
import { Header } from '../Header/Header'
import { makeStyles } from '@material-ui/core/styles'
import { Helmet } from 'react-helmet'
import notFoundImage from '../../assets/notfound.webp'

const useStyles = makeStyles(theme => ({
  errorSection: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
}))

interface ErrorLayoutProps {
  code: number
  title: string
  description: string
  message: string
  showHomeButton?: boolean
  showBackButton?: boolean
}

export const ErrorLayout = ({
  code,
  title,
  description,
  message,
  showHomeButton = true,
  showBackButton = true,
}: ErrorLayoutProps) => {
  const classes = useStyles()
  const navigate = useNavigate()

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <Box className={classes.errorSection}>
        <Header />
        <img
          src={notFoundImage}
          alt={title}
          style={{ maxWidth: '80%', width: '100%', marginBottom: '2rem' }}
        />
        <Box
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%)',
          }}>
          <Typography
            variant="h1"
            color="textPrimary"
            align="center"
            gutterBottom>
            {code}
          </Typography>

          <Typography variant="h4" align="center" gutterBottom>
            {title}
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            paragraph>
            {message}
          </Typography>

          <Box display="flex" justifyContent="center">
            {showBackButton && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBack />}>
                Назад
              </Button>
            )}

            {showHomeButton && (
              <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary">
                На главную
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  )
}
