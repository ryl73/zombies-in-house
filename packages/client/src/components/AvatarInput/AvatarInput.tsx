import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { Avatar, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { changeAvatar } from '../../api/UserAPI'
import { selectUser } from '../../slices/userSlice'
import notFoundImage from '../../assets/notfound.webp'
import { useNotification } from '../../hooks/useNotification'
import { useAppSelector } from '../../hooks/useApp'

//визуал аватара будет изменёт согласно другой задаче
const useStyles = makeStyles(theme => ({
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    margin: '20px',
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
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
          ? 'https://ya-praktikum.tech/api/v2/resources/' + userData.avatar
          : (notFoundImage as string)
      )
  }, [])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('avatar', file)
      changeAvatar(formData).catch(err => {
        const errorMassage = err.response?.data?.reason
          ? err.response.data?.reason
          : 'Ошибка при смене пароля'
        showError(errorMassage)
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
        style={{ width: 128, height: 128 }}
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
