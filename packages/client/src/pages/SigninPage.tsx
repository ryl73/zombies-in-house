import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { PageContainer } from '../styles/PageContainer'
import { Form } from '../styles/Form'
import { Input } from '../styles/Input'
import { Button } from '../styles/Buttons'
import { ThemedHeader } from '../styles/ThemedHeader'
import { useEffect, useRef, useState } from 'react'
import FormValidator from '../utils/formValidator'
import { ValidationResult } from '../types/types'

type ValidFields = {
  login: ValidationResult
  password: ValidationResult
}

export const SigninPage = () => {
  const validatorRef = useRef<FormValidator | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const [validFields, setValidFields] = useState<ValidFields>({
    login: { valid: true },
    password: { valid: true },
  })
  const [loginValue, setLoginValue] = useState('')
  const [passValue, setPassValue] = useState('')

  useEffect(() => {
    validatorRef.current = new FormValidator(formRef)
  }, [])

  const handleLoginValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLoginValue(e.target.value)
  }

  const handlePassValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassValue(e.target.value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (!validatorRef.current) return
    const input = e.target
    const validatedInput = validatorRef.current.validateInput(input)
    setTimeout(() => {
      setValidFields(prev => ({ ...prev, [input.name]: validatedInput }))
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (!validatorRef.current) return
    const validatedForm = validatorRef.current.validateForm()
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
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input
            id="login"
            type="text"
            name="login"
            placeholder="Логин"
            value={loginValue}
            onChange={handleLoginValueChange}
            onBlur={handleBlur}
          />
          {!validFields.login.valid && <p>{validFields.login.error}</p>}
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Пароль"
            value={passValue}
            onChange={handlePassValueChange}
            onBlur={handleBlur}
          />
          {!validFields.password.valid && <p>{validFields.password.error}</p>}
          <Button type="submit">ВОЙТИ</Button>
        </Form>
      </PageContainer>
    </>
  )
}

export const initSigninPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
