import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Header } from '../components/Header/Header'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Divider,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowBack } from '@material-ui/icons'
import * as Yup from 'yup'
import { validation } from '../utils/validation'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    marginTop: theme.spacing(3),
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  backButton: {
    marginBottom: theme.spacing(2),
  },
}))

interface FormData {
  title: string
  content: string
}

interface FormErrors {
  title: string
  content: string
}

const TopicCreateSchema = Yup.object().shape({
  title: Yup.string()
    .required('Заголовок обязателен')
    .matches(validation.notEmpty.pattern, validation.notEmpty.message),
  content: Yup.string()
    .required('Содержание обязательно')
    .matches(validation.notEmpty.pattern, validation.notEmpty.message),
})

export const ForumCreatePage = () => {
  usePage({ initPage: initForumCreatePage })
  const classes = useStyles()

  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
  })

  const [errors, setErrors] = useState<FormErrors>({
    title: '',
    content: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const fieldName = name as keyof FormData

    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }))

    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await TopicCreateSchema.validate(formData, { abortEarly: false })

      setErrors({
        title: '',
        content: '',
      })

      // Делаю имитацию загрузки данных
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Создание топика:', formData)
      setFormData({
        title: '',
        content: '',
      })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {
          title: '',
          content: '',
        }

        error.inner.forEach(err => {
          if (err.path && err.path in validationErrors) {
            validationErrors[err.path as keyof FormErrors] = err.message
          }
        })

        setErrors(validationErrors)
      } else {
        console.error('Ошибка при создании топика:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box className={classes.root}>
      <Helmet>
        <title>Создание топика | Форум | Зомби в доме</title>
        <meta
          name="description"
          content="Создание нового топика на форуме игры Зомби в доме"
        />
      </Helmet>

      <Header />

      <Container
        maxWidth="md"
        style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Button
          component={Link}
          to="/forum"
          startIcon={<ArrowBack />}
          className={classes.backButton}
          color="primary">
          Назад к форуму
        </Button>

        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h3" component="h1" gutterBottom>
            Создание нового топика
          </Typography>

          <Divider style={{ marginBottom: 24 }} />

          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              name="title"
              label="Заголовок топика"
              variant="outlined"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              className={classes.textField}
              disabled={isSubmitting}
              placeholder="Например: Как пройти первый уровень?"
            />

            <TextField
              name="content"
              label="Содержание топика"
              variant="outlined"
              fullWidth
              multiline
              minRows={8}
              value={formData.content}
              onChange={handleChange}
              error={!!errors.content}
              helperText={errors.content}
              className={classes.textField}
              disabled={isSubmitting}
              placeholder="Опишите подробно ваш вопрос или тему для обсуждения..."
            />

            <Box className={classes.buttonGroup}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}>
                {isSubmitting ? 'Создание...' : 'Создать топик'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export const initForumCreatePage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
