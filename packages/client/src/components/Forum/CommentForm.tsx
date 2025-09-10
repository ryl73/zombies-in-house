import React, { useState, useCallback } from 'react'
import { Box, TextField, Button, Typography } from '@material-ui/core'
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
}))

const CommentSchema = Yup.object().shape({
  content: Yup.string()
    .required('Комментарий не может быть пустым')
    .matches(validation.notEmpty.pattern, validation.notEmpty.message)
    .min(5, 'Комментарий должен содержать минимум 5 символов'),
})

const useValidation = (schema: Yup.ObjectSchema<any>) => {
  const validate = useCallback(
    async (data: Record<string, unknown>): Promise<string> => {
      try {
        await schema.validate(data, { abortEarly: false })
        return ''
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          return err.message
        }
        return 'Произошла неизвестная ошибка при валидации'
      }
    },
    [schema]
  )

  return validate
}

interface CommentFormProps {
  onSubmit: (content: string) => void
  isSubmitting?: boolean
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const classes = useStyles()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const validate = useValidation(CommentSchema)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = await validate({ content })
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    onSubmit(content.trim())
    setContent('')
    setIsTouched(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(e.target.value)

    if (error) {
      setError('')
    }
  }

  const handleBlur = async () => {
    setIsTouched(true)
    const validationError = await validate({ content })
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
          placeholder="Напишите ваш комментарий..."
          className={classes.textField}
          disabled={isSubmitting}
          error={isTouched && !!error}
          helperText={isTouched ? error : ''}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </Button>
      </form>
    </Box>
  )
}
