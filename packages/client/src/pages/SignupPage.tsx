import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { Form } from '../styles/Form'
import { PageContainer } from '../styles/PageContainer'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import { signup, SignUpRequest } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'

export const SignupPage = () => {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const login = formData.get('login') as string
    const firstName = formData.get('first_name') as string
    const secondName = formData.get('second_name') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string
    const requestData: SignUpRequest = {
      email,
      login,
      first_name: firstName,
      second_name: secondName,
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
        <Form onSubmit={handleSubmit}>
          <Input name="email" type="text" placeholder="Почта" />
          <Input name="login" type="text" placeholder="Логин" />
          <Input name="first_name" type="text" placeholder="Имя" />
          <Input name="second_name" type="text" placeholder="Фамилия" />
          <Input name="phone" type="text" placeholder="Телефон" />
          <Input name="password" type="password" placeholder="Пароль" />
          <Input
            name="password_repeat"
            type="password"
            placeholder="Повторите пароль"
          />
          <Button type="submit">Войти</Button>
        </Form>
      </PageContainer>
    </div>
  )
}

export const initSignupPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
