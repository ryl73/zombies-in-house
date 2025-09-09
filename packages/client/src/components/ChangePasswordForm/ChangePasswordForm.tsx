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
  const { showSuccess, showError } = useNotification()
  const onSubmit = async ({
    newPassword,
    password,
  }: {
    newPassword: string
    password: string
  }) => {
    const requestData: ChangePasswordRequest = {
      oldPassword: password,
      newPassword,
    }
    changePassword(requestData)
      .then(() => showSuccess('Пароль успешно изменён!'))
      .catch(error => {
        const errorMassage = error.response?.data?.reason
          ? error.response.data?.reason
          : 'Ошибка при смене пароля'
        showError(errorMassage)
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
          />
          {errors.password && touched.password && (
            <ErrorMessage>{errors.password}</ErrorMessage>
          )}
          <Button type="submit">СМЕНИТЬ ПАРОЛЬ</Button>
        </StyledForm>
      )}
    </Formik>
  )
}
