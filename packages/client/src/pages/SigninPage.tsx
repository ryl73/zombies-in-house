import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import styled from 'styled-components'

export const SigninPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход</title>
        <meta name="description" content="Страница логина" />
      </Helmet>
      <SigninForm>
        <input type="text" placeholder="Логин" />
        <input type="password" placeholder="Пароль" />
        <button type="submit">Войти</button>
      </SigninForm>
    </div>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}

const SigninForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;

  input,
  button {
    padding: 0.5rem;
  }
`
