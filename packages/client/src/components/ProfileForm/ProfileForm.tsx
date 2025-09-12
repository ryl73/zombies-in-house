import { Form as StyledForm } from '../../styles/Form'
import React from 'react'
import { Input } from '../../styles/Input'
import { changeUser, ChangeUserRequest } from '../../api/UserAPI'
import * as Yup from 'yup'
import { ErrorMessage } from '../../styles/Errors'
import { Formik, Field } from 'formik'
import {
  EmailSchema,
  LoginSchema,
  NameSchema,
  PhoneSchema,
} from '../../utils/validation'
import { Button } from '../../styles/Buttons'
import { useNotification } from '../../hooks/useNotification'
import { selectUser } from '../../slices/userSlice'
import { useAppSelector } from '../../hooks/useApp'

const ChangeProfileSchema = Yup.object().shape({
  login: LoginSchema,
  first_name: NameSchema('Имя обязательно'),
  second_name: NameSchema('Фамилия обязательна'),
  email: EmailSchema,
  phone: PhoneSchema,
})

export const ChangeProfileForm = () => {
  const { showSuccess, showError } = useNotification()
  const userData = useAppSelector(selectUser)
  const onSubmit = (values: ChangeUserRequest) => {
    changeUser(values)
      .then(() => showSuccess('Профиль успешно изменён!'))
      .catch(error => {
        const errorMessage = error.response?.data?.reason
          ? error.response.data?.reason
          : 'Ошибка при изменении профиля'
        showError(errorMessage)
      })
  }

  return userData ? (
    <Formik
      initialValues={{
        login: userData.login,
        display_name: userData.displayName ? userData.displayName : '',
        first_name: userData.firstName,
        second_name: userData.secondName,
        email: userData.email,
        phone: userData.phone,
      }}
      validationSchema={ChangeProfileSchema}
      onSubmit={onSubmit}>
      {({ errors, touched, handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Field
            as={Input}
            id="login"
            name="login"
            type="text"
            placeholder="Логин"
          />
          {errors.login && touched.login && (
            <ErrorMessage>{errors.login}</ErrorMessage>
          )}
          <Field
            as={Input}
            id="display_name"
            name="display_name"
            type="text"
            placeholder="Отображаемое имя"
          />
          {errors.display_name && touched.display_name && (
            <ErrorMessage>{errors.display_name}</ErrorMessage>
          )}
          <Field
            as={Input}
            id="first_name"
            name="first_name"
            type="text"
            placeholder="Имя"
          />
          {errors.first_name && touched.first_name && (
            <ErrorMessage>{errors.first_name}</ErrorMessage>
          )}
          <Field
            as={Input}
            id="second_name"
            name="second_name"
            type="text"
            placeholder="Фамилия"
          />
          {errors.second_name && touched.second_name && (
            <ErrorMessage>{errors.second_name}</ErrorMessage>
          )}
          <Field
            as={Input}
            id="email"
            name="email"
            type="email"
            placeholder="Электронный адрес"
          />
          {errors.email && touched.email && (
            <ErrorMessage>{errors.email}</ErrorMessage>
          )}
          <Field
            as={Input}
            id="phone"
            name="phone"
            type="text"
            placeholder="Телефон"
          />
          {errors.phone && touched.phone && (
            <ErrorMessage>{errors.phone}</ErrorMessage>
          )}
          <Button type="submit">СОХРАНИТЬ ИЗМЕНЕНИЯ</Button>
        </StyledForm>
      )}
    </Formik>
  ) : (
    <></>
  )
}
