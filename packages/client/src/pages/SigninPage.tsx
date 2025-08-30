import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { PageContainer } from '../styles/PageContainer'
import { Form } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import { signIn, type SignInRequest } from '../api/LoginAPI'
import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export const SigninPage = () => {
  const navigate = useNavigate()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const login = formData.get('login') as string
    const password = formData.get('password') as string
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
        <Form onSubmit={handleSubmit}>
          <Input name="login" type="text" placeholder="Логин" />
          <Input name="password" type="password" placeholder="Пароль" />
          <Button type="submit">ВОЙТИ</Button>
        </Form>
      </PageContainer>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
