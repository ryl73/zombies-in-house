import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { Form } from '../styles/Form'
import { PageContainer } from '../styles/PageContainer'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { validation } from '../utils/validation'
import { ErrorMessage } from '../styles/Errors'

const schema = z
  .object({
    email: z.string().regex(validation.email.pattern, validation.email.message),
    login: z
      .string()
      .min(3, 'Логин должен быть не менее 3 символов')
      .max(20, 'Логин должен быть не более 20 символов')
      .regex(validation.login.pattern, validation.login.message),
    first_name: z
      .string()
      .regex(validation.name.pattern, validation.name.message),
    second_name: z
      .string()
      .regex(validation.name.pattern, validation.name.message),
    phone: z
      .string()
      .min(10, 'Номер телефона должен содержать не менее 10 цифр')
      .max(15, 'Номер телефона не должен быть более 15 цифр')
      .regex(validation.phone.pattern, validation.phone.message),
    password: z
      .string()
      .min(8, 'Пароль должен быть не менее 8 символов')
      .max(40, 'Пароль должен быть не более 40 символов')
      .regex(validation.password.pattern, validation.password.message),
    password_repeat: z
      .string()
      .min(8, 'Пароль должен быть не менее 8 символов')
      .max(40, 'Пароль должен быть не более 40 символов')
      .regex(validation.password.pattern, validation.password.message),
  })
  .refine(data => data.password === data.password_repeat, {
    message: 'Пароли должны совпадать',
    path: ['password_repeat'],
  })

type Schema = z.infer<typeof schema>

export const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  const onSubmit = (data: Schema) => {
    console.log(data)
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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            type="text"
            placeholder="Почта"
            {...register('email')}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          <Input
            id="login"
            type="text"
            placeholder="Логин"
            {...register('login')}
          />
          {errors.login && <ErrorMessage>{errors.login.message}</ErrorMessage>}
          <Input
            id="first_name"
            type="text"
            placeholder="Имя"
            {...register('first_name')}
          />
          {errors.first_name && (
            <ErrorMessage>{errors.first_name.message}</ErrorMessage>
          )}
          <Input
            id="second_name"
            type="text"
            placeholder="Фамилия"
            {...register('second_name')}
          />
          {errors.second_name && (
            <ErrorMessage>{errors.second_name.message}</ErrorMessage>
          )}
          <Input
            id="phone"
            type="text"
            placeholder="Телефон"
            {...register('phone')}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
          <Input
            id="password"
            type="password"
            placeholder="Пароль"
            {...register('password')}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
          <Input
            id="password_repeat"
            type="password"
            placeholder="Повторите пароль"
            {...register('password_repeat')}
          />
          {errors.password_repeat && (
            <ErrorMessage>{errors.password_repeat.message}</ErrorMessage>
          )}
          <Button type="submit">Войти</Button>
        </Form>
      </PageContainer>
    </div>
  )
}

export const initSignupPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
