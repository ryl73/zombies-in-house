import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { PageContainer } from '../styles/PageContainer'
import { Form as StyledForm } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import { signIn, type SignInRequest } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'

import * as Yup from 'yup'
import { ErrorMessage } from '../styles/Errors'
import { Formik, Field } from 'formik'
import { validation } from '../utils/validation'
const SigninSchema = Yup.object().shape({
  login: Yup.string()
    .matches(validation.login.pattern, validation.login.message)
    .required('Логин обязателен'),
  password: Yup.string()
    .min(8, 'Пароль должен быть больше 8 символов')
    .max(40, 'Пароль должен быть не более 40 символов')
    .matches(validation.password.pattern, validation.password.message)
    .required('Пароль обязателен'),
})

export const SigninPage = () => {
  const navigate = useNavigate()
  const onSubmit = (values: { login: string; password: string }) => {
    const requestData: SignInRequest = { login, password }
    await signIn(requestData)
    navigate('/')
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
