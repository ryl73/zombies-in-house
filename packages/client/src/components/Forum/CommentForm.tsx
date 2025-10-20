import React, { useState, useCallback } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as Yup from 'yup'
import { validation } from '../../utils/validation'

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

const CommentSchema = Yup.object().shape({
  content: Yup.string()
    .required('Комментарий не может быть пустым')
    .matches(validation.notEmpty.pattern, validation.notEmpty.message)
    .min(5, 'Комментарий должен содержать минимум 5 символов')
    .max(1000, 'Комментарий не должен превышать 1000 символов'),
})

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  isSubmitting?: boolean
  placeholder?: string
  submitText?: string
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isSubmitting = false,
  placeholder = 'Напишите ваш комментарий...',
  submitText = 'Отправить',
}) => {
  const classes = useStyles()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [isTouched, setIsTouched] = useState(false)

  const validate = useCallback(async (text: string): Promise<string> => {
    try {
      await CommentSchema.validate({ content: text }, { abortEarly: false })
      return ''
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return err.message
      }
      return 'Произошла неизвестная ошибка при валидации'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = await validate(content)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    try {
      await onSubmit(content.trim())
      setContent('')
      setIsTouched(false)
    } catch (error) {
      setError('Ошибка при отправке комментария')
    }
  }

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newContent = e.target.value
    setContent(newContent)

    if (error && isTouched) {
      const validationError = await validate(newContent)
      setError(validationError)
    }
  }

  const handleBlur = async () => {
    setIsTouched(true)
    const validationError = await validate(content)
    setError(validationError)
  }

  return (
    <Box className={classes.form}>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Добавить комментарий
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          multiline
          minRows={4}
          fullWidth
          variant="outlined"
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={classes.textField}
          disabled={isSubmitting}
          error={isTouched && !!error}
          helperText={isTouched ? error : ''}
        />
        <Box className={classes.buttonWrapper}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !content.trim() || !!error}>
            {isSubmitting ? 'Отправка...' : submitText}
          </Button>
          {isSubmitting && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Box>
      </form>
    </Box>
  )
}
