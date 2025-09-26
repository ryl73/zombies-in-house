import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { signIn, type SignInRequest } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { LoginSchema, PasswordSchema } from '../utils/validation'
import { useNotification } from '../hooks/useNotification'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/userSlice'
import { getUser } from '../api/UserAPI'
import { Link } from 'react-router-dom'
import {
  TextField,
  Button,
  FormControl,
  makeStyles,
  Box,
  Typography,
} from '@material-ui/core'

const SigninSchema = Yup.object().shape({
  login: LoginSchema,
  password: PasswordSchema,
})

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: '100vh',
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
    margin: '30px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 550,
    marginBottom: '20px',
  },
}))

export const SigninPage = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showError } = useNotification()
  const onSubmit = async (values: { login: string; password: string }) => {
    const { login, password } = values
    const requestData: SignInRequest = {
      login,
      password,
    }
    signIn(requestData)
      .then(() =>
        getUser().then(u => {
          dispatch(setUser(u))
          navigate('/')
        })
      )
      .catch(err => {
        const errorMessage = err.response?.data?.reason
          ? err.response.data?.reason
          : 'Ошибка при входе'
        showError(errorMessage)
      })
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход</title>
        <meta name="description" content="Страница логина" />
      </Helmet>
      <Box className={classes.pageContainer}>
        <Typography variant="h1" className={classes.themedHeader}>
          ВХОД
        </Typography>
        <Formik
          initialValues={{ login: '', password: '' }}
          validationSchema={SigninSchema}
          onSubmit={onSubmit}>
          {({ errors, touched, handleSubmit, handleChange, handleBlur }) => (
            <FormControl
              component="form"
              onSubmit={handleSubmit}
              className={classes.form}>
              <TextField
                id="login"
                name="login"
                label="Логин"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.login && Boolean(errors.login)}
                helperText={touched.login && errors.login}
              />

              <TextField
                id="password"
                name="password"
                type="password"
                label="Пароль"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large">
                ВОЙТИ
              </Button>
            </FormControl>
          )}
        </Formik>
        <Button
          component={Link}
          to="/signup"
          variant="text"
          size="large"
          color="default">
          Регистрация
        </Button>
      </Box>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
