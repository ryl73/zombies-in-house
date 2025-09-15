import * as Yup from 'yup'

export const validation = {
  name: {
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яё-]+(?:-[A-ZА-ЯЁ][a-zA-Zа-яё-]+)?$/u,
    message:
      'Первая буква должна быть заглавной, только буквы и дефис, без пробелов и цифр',
  },
  login: {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
    message:
      'От 3 до 20 символов, латиница, цифры, дефис, нижнее подчёркивание; не может состоять только из цифр',
  },
  email: {
    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
    message: 'Неверный формат email',
  },
  password: {
    pattern: /^(?=.*[A-ZА-ЯЁ])(?=.*\d)[^\s]{8,40}$/u,
    message: 'От 8 до 40 символов, обязательно заглавная буква и цифра',
  },
  phone: {
    pattern: /^\+?(?:\D*\d){10,15}\D*$/,
    message: 'Телефон от 10 до 15 цифр, может начинаться с +',
  },
  notEmpty: {
    pattern: /^(?!\s*$).+/,
    message: 'Сообщение не должно быть пустым',
  },
}

export const PasswordSchema = Yup.string()
  .min(8, 'Пароль должен быть больше 8 символов')
  .max(40, 'Пароль должен быть не более 40 символов')
  .matches(validation.password.pattern, validation.password.message)
  .required('Пароль обязателен')

export const LoginSchema = Yup.string()
  .min(3, 'Логин должен быть не менее 3 символов')
  .max(20, 'Логин должен быть не более 20 символов')
  .matches(validation.login.pattern, validation.login.message)
  .required('Логин обязателен')

export const PhoneSchema = Yup.string()
  .min(10, 'Номер телефона должен содержать не менее 10 цифр')
  .max(15, 'Номер телефона не должен быть более 15 цифр')
  .matches(validation.phone.pattern, validation.phone.message)
  .required('Телефон обязателен')

export const NameSchema = (requiredMes: string) =>
  Yup.string()
    .matches(validation.name.pattern, validation.name.message)
    .required(requiredMes)

export const EmailSchema = Yup.string()
  .matches(validation.email.pattern, validation.email.message)
  .required('Почта обязательна')

export const RepeatPasswordSchema = (pasFieldName: string) =>
  Yup.string()
    .oneOf([Yup.ref(pasFieldName)], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно')
