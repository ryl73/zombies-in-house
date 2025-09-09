import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { PageContainer } from '../styles/PageContainer'
import { Form as StyledForm } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import { signup } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage } from '../styles/Errors'
import { Formik, Field } from 'formik'
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

export const SignupPage = () => {
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
        const errorMassage = error.response?.data?.reason
          ? error.response.data?.reason
          : 'Ошибка при регистрации'
        showError(errorMassage)
      })
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации" />
      </Helmet>
      <PageContainer>
        <ThemedHeader>РЕГИСТРАЦИЯ</ThemedHeader>
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
          {({ errors, touched, handleSubmit }) => (
            <StyledForm onSubmit={handleSubmit}>
              <Field as={Input} name="email" placeholder="Почта" />
              {errors.email && touched.email && (
                <ErrorMessage>{errors.email}</ErrorMessage>
              )}

              <Field as={Input} name="login" placeholder="Логин" />
              {errors.login && touched.login && (
                <ErrorMessage>{errors.login}</ErrorMessage>
              )}

              <Field as={Input} name="first_name" placeholder="Имя" />
              {errors.first_name && touched.first_name && (
                <ErrorMessage>{errors.first_name}</ErrorMessage>
              )}

              <Field as={Input} name="second_name" placeholder="Фамилия" />
              {errors.second_name && touched.second_name && (
                <ErrorMessage>{errors.second_name}</ErrorMessage>
              )}

              <Field as={Input} name="phone" placeholder="Телефон" />
              {errors.phone && touched.phone && (
                <ErrorMessage>{errors.phone}</ErrorMessage>
              )}

              <Field
                as={Input}
                name="password"
                type="password"
                placeholder="Пароль"
              />
              {errors.password && touched.password && (
                <ErrorMessage>{errors.password}</ErrorMessage>
              )}

              <Field
                as={Input}
                name="password_repeat"
                type="password"
                placeholder="Повторите пароль"
              />
              {errors.password_repeat && touched.password_repeat && (
                <ErrorMessage>{errors.password_repeat}</ErrorMessage>
              )}

              <Button type="submit">Зарегистрироваться</Button>
            </StyledForm>
          )}
        </Formik>
      </PageContainer>
    </div>
  )
}

export const initSignupPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
