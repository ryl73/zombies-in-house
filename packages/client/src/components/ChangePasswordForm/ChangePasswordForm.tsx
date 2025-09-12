import { Form as StyledForm } from '../../styles/Form'
import React from 'react'
import { Input } from '../../styles/Input'
import { changePassword, ChangePasswordRequest } from '../../api/UserAPI'
import * as Yup from 'yup'
import { ErrorMessage } from '../../styles/Errors'
import { Formik, Field } from 'formik'
import { PasswordSchema, RepeatPasswordSchema } from '../../utils/validation'
import { Button } from '../../styles/Buttons'
import { useNotification } from '../../hooks/useNotification'

const ChangePasswordSchema = Yup.object().shape({
  newPassword: PasswordSchema,
  reNewPassword: RepeatPasswordSchema('newPassword'),
  password: PasswordSchema,
})

export const ChangePasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { showSuccess, showError } = useNotification()
  const onSubmit = (
    {
      newPassword,
      password,
    }: {
      newPassword: string
      password: string
    },
    {
      setFieldValue,
    }: {
      setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean
      ) => void
    }
  ) => {
    setIsSubmitting(true)
    const requestData: ChangePasswordRequest = {
      oldPassword: password,
      newPassword,
    }
    changePassword(requestData)
      .then(() => showSuccess('Пароль успешно изменён!'))
      .catch(error => {
        const errorMessage = error.response?.data?.reason
          ? error.response.data.reason
          : 'Ошибка при смене пароля'
        setFieldValue('newPassword', '', false) // false = не валидировать
        setFieldValue('reNewPassword', '', false)
        setFieldValue('password', '', false)
        showError(errorMessage)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }
  return (
    <Formik
      initialValues={{ newPassword: '', reNewPassword: '', password: '' }}
      validationSchema={ChangePasswordSchema}
      onSubmit={onSubmit}>
      {({ errors, touched, handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Field
            as={Input}
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Новый пароль"
            disabled={isSubmitting}
          />
          {errors.newPassword && touched.newPassword && (
            <ErrorMessage>{errors.newPassword}</ErrorMessage>
          )}

          <Field
            as={Input}
            id="reNewPassword"
            name="reNewPassword"
            type="password"
            placeholder="Повторите новый пароль"
            disabled={isSubmitting}
          />
          {errors.reNewPassword && touched.reNewPassword && (
            <ErrorMessage>{errors.reNewPassword}</ErrorMessage>
          )}

          <Field
            as={Input}
            id="password"
            name="password"
            type="password"
            placeholder="Старый пароль"
            disabled={isSubmitting}
          />
          {errors.password && touched.password && (
            <ErrorMessage>{errors.password}</ErrorMessage>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'СОХРАНЕНИЕ...' : 'СМЕНИТЬ ПАРОЛЬ'}
          </Button>
        </StyledForm>
      )}
    </Formik>
  )
}
