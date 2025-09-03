import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { PageContainer } from '../styles/PageContainer'
import { Form as StyledForm } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import { signup, SignUpRequest } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage } from '../styles/Errors'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import { validation } from '../utils/validation'

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
  email: Yup.string()
    .matches(validation.email.pattern, validation.email.message)
    .required('Почта обязательна'),
  login: Yup.string()
    .min(3, 'Логин должен быть не менее 3 символов')
    .max(20, 'Логин должен быть не более 20 символов')
    .matches(validation.login.pattern, validation.login.message)
    .required('Логин обязателен'),
  first_name: Yup.string()
    .matches(validation.name.pattern, validation.name.message)
    .required('Имя обязательно'),
  second_name: Yup.string()
    .matches(validation.name.pattern, validation.name.message)
    .required('Фамилия обязательна'),
  phone: Yup.string()
    .min(10, 'Номер телефона должен содержать не менее 10 цифр')
    .max(15, 'Номер телефона не должен быть более 15 цифр')
    .matches(validation.phone.pattern, validation.phone.message)
    .required('Телефон обязателен'),
  password: Yup.string()
    .min(8, 'Пароль должен быть не менее 8 символов')
    .max(40, 'Пароль должен быть не более 40 символов')
    .matches(validation.password.pattern, validation.password.message)
    .required('Пароль обязателен'),
  password_repeat: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Повторите пароль'),
})

export const SignupPage = () => {
  const navigate = useNavigate()
  const onSubmit = (values: FormValues) => {
    const { email, login, first_name, second_name, phone, password } = values;
    const requestData: SignUpRequest = {
      email,
      login,
      first_name,
      second_name,
      phone,
      password,
    }
    await signup(requestData)
    navigate('/')
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
