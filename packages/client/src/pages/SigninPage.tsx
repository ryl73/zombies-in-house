import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import styled from 'styled-components'

export const SigninPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход</title>
        <meta name="description" content="Страница логина" />
      </Helmet>
      <SigninContainer>
        <SigninForm onSubmit={handleSubmit}>
          <Header className="font-secondary">ВХОД</Header>
          <Input id="login" type="text" placeholder="Логин" />
          <Input id="password" type="password" placeholder="Пароль" />
          <Button type="submit">ВОЙТИ</Button>
        </SigninForm>
      </SigninContainer>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}

const SigninContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-bg-primary);
  display: flex;
  justify-content: center;
  align-items: center;
`

const SigninForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 550px;
  margin-bottom: 100px;
`

const Header = styled.h1`
  text-align: center;
  color: var(--color-primary);
  font-size: 64px;
  line-height: 64px;
`

const Input = styled.input`
  background: transparent;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--color-green-100) 50%, transparent);
  outline: none;
  padding: 16px 12px;
  color: var(--color-primary);
`

const Button = styled.button`
  background-color: var(--color-button-primary);
  border-radius: 8px;
  border: none;
  padding: 16px 12px;
  color: var(--color-primary);
  margin-top: 1rem;
`
