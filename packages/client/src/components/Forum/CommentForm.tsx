import React, { useState } from 'react'
import { Box, TextField, Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as Yup from 'yup'

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
    .min(5, 'Комментарий должен содержать минимум 5 символов'),
})

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await CommentSchema.validate({ content })

      setError('')
      onSubmit(content.trim())
      setContent('')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message)
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(e.target.value)

    if (error) {
      setError('')
    }
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
          onBlur={() => {
            if (content.trim()) {
              CommentSchema.validate({ content })
                .then(() => setError(''))
                .catch(err => {
                  if (err instanceof Yup.ValidationError) {
                    setError(err.message)
                  }
                })
            }
          }}
          placeholder="Напишите ваш комментарий..."
          className={classes.textField}
          disabled={isSubmitting}
          error={!!error}
          helperText={error}
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
