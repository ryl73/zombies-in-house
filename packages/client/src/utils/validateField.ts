import { ValidationResult } from '../types/types'

const patterns = {
  first_name: /^[A-ZА-ЯЁ][a-zA-Zа-яё-]+(?:-[A-ZА-ЯЁ][a-zA-Zа-яё-]+)?$/u,
  second_name: /^[A-ZА-ЯЁ][a-zA-Zа-яё-]+(?:-[A-ZА-ЯЁ][a-zA-Zа-яё-]+)?$/u,
  login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
  password: /^(?=.*[A-ZА-ЯЁ])(?=.*\d)[^\s]{8,40}$/u,
  phone: /^\+?(?:\D*\d){10,15}\D*$/,
}

export default function validateField(
  name: string,
  value: string,
  relatedValues?: Record<string, string>
): ValidationResult {
  if (!value.trim()) {
    return { valid: false, error: 'Поле не может быть пустым' }
  }

  switch (name) {
    case 'first_name':
    case 'second_name':
      if (!patterns[name].test(value)) {
        return {
          valid: false,
          error:
            'Первая буква должна быть заглавной, только буквы и дефис, без пробелов и цифр',
        }
      }
      break

    case 'login':
      if (!patterns.login.test(value)) {
        return {
          valid: false,
          error:
            'От 3 до 20 символов, латиница, цифры, дефис, нижнее подчёркивание; не может состоять только из цифр',
        }
      }
      break

    case 'email':
      if (!patterns.email.test(value)) {
        return { valid: false, error: 'Неверный формат email' }
      }
      break

    case 'password':
      if (!patterns.password.test(value)) {
        return {
          valid: false,
          error: 'От 8 до 40 символов, обязательно заглавная буква и цифра',
        }
      }
      break

    case 'password_repeat':
      if (!patterns.password.test(value)) {
        return {
          valid: false,
          error: 'От 8 до 40 символов, обязательно заглавная буква и цифра',
        }
      }
      if (relatedValues && value !== relatedValues.password) {
        return { valid: false, error: 'Пароли не совпадают' }
      }
      break

    case 'phone':
      if (!patterns.phone.test(value)) {
        return {
          valid: false,
          error: 'Телефон от 10 до 15 цифр, может начинаться с +',
        }
      }
      break

    default:
      return { valid: true }
  }

  return { valid: true }
}
