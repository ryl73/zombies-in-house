import { ValidationResult } from '../types/types'
import validateField from './validateField'

export default class FormValidator {
  private form: React.MutableRefObject<HTMLFormElement | null>

  constructor(form: React.MutableRefObject<HTMLFormElement | null>) {
    this.form = form
  }

  validateInput(input: HTMLInputElement): ValidationResult {
    let result: ValidationResult

    const { name, value } = input
    if (input.name === 'password_repeat') {
      const password = document.querySelector<HTMLInputElement>(
        'input[name="password"]'
      )
      if (!password) return { valid: false }
      result = validateField(name, value, { [password.name]: password.value })
    } else {
      result = validateField(name, value)
    }

    return result
  }

  validateForm(): boolean | void {
    if (!this.form.current) return

    const inputs = Array.from(this.form.current.elements).filter(
      (el): el is HTMLInputElement => el instanceof HTMLInputElement
    )

    return inputs.every(input => this.validateInput(input).valid)
  }
}
