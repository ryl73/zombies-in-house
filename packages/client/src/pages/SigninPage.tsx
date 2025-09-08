import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { PageContainer } from '../styles/PageContainer'
import { Form as StyledForm } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import { getUser, signIn, type SignInRequest } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { ErrorMessage } from '../styles/Errors'
import { Formik, Field } from 'formik'
import { LoginSchema, PasswordSchema } from '../utils/validation'
import { useNotification } from '../hooks/useNotification'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/userSlice'

const SigninSchema = Yup.object().shape({
  login: LoginSchema,
  password: PasswordSchema,
})

export const SigninPage = () => {
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
        const errorMassage = err.response?.data?.reason
          ? err.response.data?.reason
          : 'Ошибка при входе'
        showError(errorMassage)
      })
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход</title>
        <meta name="description" content="Страница логина" />
      </Helmet>
      <PageContainer>
        <ThemedHeader>ВХОД</ThemedHeader>
        <Formik
          initialValues={{ login: '', password: '' }}
          validationSchema={SigninSchema}
          onSubmit={onSubmit}>
          {({ errors, touched, handleSubmit }) => (
            <StyledForm onSubmit={handleSubmit}>
              <Field as={Input} id="login" name="login" placeholder="Логин" />
              {errors.login && touched.login && (
                <ErrorMessage>{errors.login}</ErrorMessage>
              )}

              <Field
                as={Input}
                id="password"
                name="password"
                type="password"
                placeholder="Пароль"
              />
              {errors.password && touched.password && (
                <ErrorMessage>{errors.password}</ErrorMessage>
              )}

              <Button type="submit">ВОЙТИ</Button>
            </StyledForm>
          )}
        </Formik>
      </PageContainer>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
