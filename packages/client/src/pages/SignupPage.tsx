import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { PageInitArgs } from '../routes'
import { Form } from '../styles/Form'
import { PageContainer } from '../styles/PageContainer'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'

export const SignupPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации" />
      </Helmet>
      <PageContainer>
        <Header className="font-secondary">РЕГИСТРАЦИЯ</Header>
        <Form onSubmit={handleSubmit}>
          <Input id="email" type="text" placeholder="Почта" />
          <Input id="login" type="text" placeholder="Логин" />
          <Input id="first_name" type="text" placeholder="Имя" />
          <Input id="second_name" type="text" placeholder="Фамилия" />
          <Input id="phone" type="text" placeholder="Телефон" />
          <Input id="password" type="password" placeholder="Пароль" />
          <Input
            id="password_repeat"
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

const Header = styled.h1`
  text-align: center;
  color: var(--color-primary);
  font-size: 64px;
  line-height: 64px;
`
