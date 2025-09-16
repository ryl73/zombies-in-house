import React from 'react'
import { changeUser, ChangeUserRequest } from '../../api/UserAPI'
import * as Yup from 'yup'
import { Formik } from 'formik'
import {
  EmailSchema,
  LoginSchema,
  NameSchema,
  PhoneSchema,
} from '../../utils/validation'
import { useNotification } from '../../hooks/useNotification'
import { selectUser } from '../../slices/userSlice'
import { useAppSelector } from '../../hooks/useApp'
import { TextField, Button, FormControl } from '@material-ui/core'

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
      {({
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
        values,
      }) => (
        <FormControl
          component="form"
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: 550,
          }}>
          <TextField
            id="login"
            name="login"
            type="text"
            label="Логин"
            value={values.login}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.login && Boolean(errors.login)}
            helperText={touched.login && errors.login}
          />

          <TextField
            id="display_name"
            name="display_name"
            type="text"
            label="Отображаемое имя"
            value={values.display_name}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.display_name && Boolean(errors.display_name)}
            helperText={touched.display_name && errors.display_name}
          />

          <TextField
            id="first_name"
            name="first_name"
            type="text"
            label="Имя"
            value={values.first_name}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.first_name && Boolean(errors.first_name)}
            helperText={touched.first_name && errors.first_name}
          />

          <TextField
            id="second_name"
            name="second_name"
            type="text"
            label="Фамилия"
            value={values.second_name}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.second_name && Boolean(errors.second_name)}
            helperText={touched.second_name && errors.second_name}
          />

          <TextField
            id="email"
            name="email"
            type="email"
            label="Электронный адрес"
            value={values.email}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            id="phone"
            name="phone"
            type="text"
            label="Телефон"
            value={values.phone}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone && Boolean(errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large">
            СОХРАНИТЬ ИЗМЕНЕНИЯ
          </Button>
        </FormControl>
      )}
    </Formik>
  ) : (
    <></>
  )
}
