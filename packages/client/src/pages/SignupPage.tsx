import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import styled from 'styled-components'

export const SignupPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации" />
      </Helmet>
      <SignupForm>
        <input type="text" placeholder="Почта" />
        <input type="text" placeholder="Логин" />
        <input type="text" placeholder="Имя" />
        <input type="text" placeholder="Фамилия" />
        <input type="text" placeholder="Телефон" />
        <input type="password" placeholder="Пароль" />
        <input type="password" placeholder="Повторите пароль" />
        <button type="submit">Войти</button>
      </SignupForm>
    </div>
  )
}

export const initSignupPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}

const SignupForm = styled.form`
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
