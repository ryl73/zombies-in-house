import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import styled from 'styled-components'
import { PageContainer } from '../styles/PageContainer'
import { Form } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'

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
      <PageContainer>
        <Form onSubmit={handleSubmit}>
          <Header className="font-secondary">ВХОД</Header>
          <Input id="login" type="text" placeholder="Логин" />
          <Input id="password" type="password" placeholder="Пароль" />
          <Button type="submit">ВОЙТИ</Button>
        </Form>
      </PageContainer>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}

const Header = styled.h1`
  text-align: center;
  color: var(--color-primary);
  font-size: 64px;
  line-height: 64px;
`
