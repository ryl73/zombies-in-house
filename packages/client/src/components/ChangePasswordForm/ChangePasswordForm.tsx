import React from 'react'
import { changePassword, ChangePasswordRequest } from '../../api/UserAPI'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { PasswordSchema, RepeatPasswordSchema } from '../../utils/validation'
import { useNotification } from '../../hooks/useNotification'
import { TextField, Button, FormControl, makeStyles } from '@material-ui/core'

const ChangePasswordSchema = Yup.object().shape({
  newPassword: PasswordSchema,
  reNewPassword: RepeatPasswordSchema('newPassword'),
  password: PasswordSchema,
})

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: 800,
    margin: '0 auto',
  },
})

export const ChangePasswordForm = () => {
  const classes = useStyles()
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
          className={classes.form}>
          <TextField
            id="newPassword"
            name="newPassword"
            type="password"
            label="Новый пароль"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.newPassword && Boolean(errors.newPassword)}
            helperText={touched.newPassword && errors.newPassword}
            disabled={isSubmitting}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            id="reNewPassword"
            name="reNewPassword"
            type="password"
            label="Повторите новый пароль"
            value={values.reNewPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.reNewPassword && Boolean(errors.reNewPassword)}
            helperText={touched.reNewPassword && errors.reNewPassword}
            disabled={isSubmitting}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            id="password"
            name="password"
            type="password"
            label="Старый пароль"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            disabled={isSubmitting}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}>
            {isSubmitting ? 'СОХРАНЕНИЕ...' : 'СМЕНИТЬ ПАРОЛЬ'}
          </Button>
        </FormControl>
      )}
    </Formik>
  )
}
