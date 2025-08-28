import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { PageContainer } from '../styles/PageContainer'
import { Form } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { validation } from '../utils/validation'
import { ErrorMessage } from '../styles/Errors'

const schema = z.object({
  login: z.string().regex(validation.login.pattern, validation.login.message),

  password: z
    .string()
    .min(8, 'Пароль должен быть больше 8 символов')
    .max(40, 'Пароль должен быть не более 40 символов')
    .regex(validation.password.pattern, validation.password.message),
})

type Schema = z.infer<typeof schema>

export const SigninPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Schema>({
    mode: 'onBlur',
  })

  const onSubmit = (data: Schema) => {
    try {
      schema.parse(data)
      console.log(data)
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            setError(issue.path[0] as keyof Schema, {
              type: 'manual',
              message: issue.message,
            })
          }
        })
      } else {
        console.error('Unexpected error', err)
      }
    }
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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="login"
            type="text"
            placeholder="Логин"
            {...register('login')}
          />
          {errors.login && <ErrorMessage>{errors.login.message}</ErrorMessage>}
          <Input
            id="password"
            type="password"
            placeholder="Пароль"
            {...register('password')}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
          <Button type="submit">ВОЙТИ</Button>
        </Form>
      </PageContainer>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
