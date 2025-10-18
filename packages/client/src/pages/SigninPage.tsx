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
  Typography,
  Container,
} from '@material-ui/core'
import { useLoginStyles } from '../styles/mui/LoginStyles'
import clsx from 'clsx'
import { useGlobalStyles } from '../styles/mui/GlobalStyles'
import { getYandexServiceId } from '../api/OAuthAPI'

const SigninSchema = Yup.object().shape({
  login: LoginSchema,
  password: PasswordSchema,
})

export const SigninPage = () => {
  const classes = useLoginStyles()
  const globalClasses = useGlobalStyles()
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

  const handleYandexOAuth = async () => {
    const redirectUri = `${window.location.origin}/oauth`

    try {
      const { service_id } = await getYandexServiceId(redirectUri)
      const oauthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${service_id}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`
      window.location.href = oauthUrl
    } catch (error) {
      showError('Не удалось начать авторизацию через Яндекс.')
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход</title>
        <meta name="description" content="Страница логина" />
      </Helmet>
      <Container
        maxWidth="lg"
        className={clsx(classes.root, classes.pageContainer)}>
        <Typography
          variant="h1"
          className={clsx(globalClasses.themedHeader, classes.themedHeader)}>
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
              className={clsx(globalClasses.form, classes.form)}>
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
          color="default"
          fullWidth
          style={{ maxWidth: 800 }}>
          Регистрация
        </Button>
        <Button
          onClick={handleYandexOAuth}
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          style={{ maxWidth: 800, marginTop: 16 }}>
          Войти через Яндекс
        </Button>
      </Container>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
