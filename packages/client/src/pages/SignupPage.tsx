import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { Form } from '../styles/Form'
import { PageContainer } from '../styles/PageContainer'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'

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
        <ThemedHeader>РЕГИСТРАЦИЯ</ThemedHeader>
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
