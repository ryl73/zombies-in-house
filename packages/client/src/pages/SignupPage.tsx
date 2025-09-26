import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { signup } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  LoginSchema,
  NameSchema,
  PasswordSchema,
  PhoneSchema,
  EmailSchema,
  RepeatPasswordSchema,
} from '../utils/validation'
import { useNotification } from '../hooks/useNotification'
import { Link } from 'react-router-dom'
import {
  TextField,
  Button,
  FormControl,
  makeStyles,
  Box,
  Typography,
} from '@material-ui/core'

type FormValues = {
  login: string
  email: string
  first_name: string
  second_name: string
  phone: string
  password: string
  password_repeat: string
}

const SignupSchema = Yup.object().shape({
  email: EmailSchema,
  login: LoginSchema,
  first_name: NameSchema('Имя обязательно'),
  second_name: NameSchema('Фамилия обязательна'),
  phone: PhoneSchema,
  password: PasswordSchema,
  password_repeat: RepeatPasswordSchema('password'),
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

export const SignupPage = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { showError } = useNotification()
  const onSubmit = async ({
    email,
    login,
    first_name,
    second_name,
    phone,
    password,
  }: FormValues) => {
    signup({ email, login, first_name, second_name, phone, password })
      .then(() => navigate('/'))
      .catch(error => {
        const errorMessage = error.response?.data?.reason
          ? error.response.data?.reason
          : 'Ошибка при регистрации'
        showError(errorMessage)
      })
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации" />
      </Helmet>
      <Box className={classes.pageContainer}>
        <Typography variant="h1" className={classes.themedHeader}>
          РЕГИСТРАЦИЯ
        </Typography>
        <Formik
          initialValues={{
            email: '',
            login: '',
            first_name: '',
            second_name: '',
            phone: '',
            password: '',
            password_repeat: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={onSubmit}>
          {({ errors, touched, handleSubmit, handleChange, handleBlur }) => (
            <FormControl
              component="form"
              onSubmit={handleSubmit}
              className={classes.form}>
              <TextField
                name="email"
                label="Почта"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                name="login"
                label="Логин"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.login && Boolean(errors.login)}
                helperText={touched.login && errors.login}
              />

              <TextField
                name="first_name"
                label="Имя"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />

              <TextField
                name="second_name"
                label="Фамилия"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.second_name && Boolean(errors.second_name)}
                helperText={touched.second_name && errors.second_name}
              />

              <TextField
                name="phone"
                label="Телефон"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />

              <TextField
                name="password"
                type="password"
                label="Пароль"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <TextField
                name="password_repeat"
                type="password"
                label="Повторите пароль"
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.password_repeat && Boolean(errors.password_repeat)
                }
                helperText={touched.password_repeat && errors.password_repeat}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large">
                Зарегистрироваться
              </Button>
            </FormControl>
          )}
        </Formik>

        <Button
          component={Link}
          to="/signin"
          variant="text"
          size="large"
          color="default">
          Есть аккаунт? Войти
        </Button>
      </Box>
    </div>
  )
}

export const initSignupPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
