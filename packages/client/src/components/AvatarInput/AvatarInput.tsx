import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { Avatar, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { changeAvatar } from '../../api/UserAPI'
import { selectUser } from '../../slices/userSlice'
import notFoundImage from '../../assets/notfound.webp'
import { useNotification } from '../../hooks/useNotification'
import { useAppSelector } from '../../hooks/useApp'
import {
  API_RESOURCES_URL,
  MAX_SIZE_AVATAR_FILE,
  MAX_SIZE_AVATAR_FILE_TEXT,
} from '../../constants'

//визуал аватара будет изменёт согласно другой задаче
const useStyles = makeStyles(theme => ({
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    margin: '20px',
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    border: `2px solid ${theme.palette.primary.main}`,
  },
  input: {
    display: 'none',
  },
}))

export const AvatarInput = () => {
  const classes = useStyles()
  const { showError } = useNotification()
  const userData = useAppSelector(selectUser)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (userData)
      setPreview(
        userData.avatar
          ? API_RESOURCES_URL + userData.avatar
          : (notFoundImage as string)
      )
  }, [userData])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        showError('Разрешены только изображения (JPEG, PNG, GIF)')
        return
      }
      if (file.size > MAX_SIZE_AVATAR_FILE) {
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
        showError(
          `Файл слишком большой. Максимальный размер: ${MAX_SIZE_AVATAR_FILE_TEXT}. Текущий размер: ${fileSizeMB}MB`
        )
        return
      }
      const formData = new FormData()
      formData.append('avatar', file)
      changeAvatar(formData).catch(err => {
        const errorMessage = err.response?.data?.reason
          ? err.response.data?.reason
          : 'Ошибка при смене аватара'
        showError(errorMessage)
      })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box className={classes.avatarContainer}>
      <Avatar
        src={preview || undefined}
        className={classes.avatar}
        onClick={handleClick}>
        {!preview && 'А'}
      </Avatar>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={classes.input}
      />
    </Box>
  )
}
