import { fetchUser, selectUser, selectUserLoading } from './slices/userSlice'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Router from './Router'
import { useAppDispatch, useAppSelector } from './hooks/useApp'
import './App.css'
import { Box, makeStyles, Typography } from '@material-ui/core'
import { useGlobalStyles } from './styles/mui/GlobalStyles'
import { getUserTheme, setUserTheme } from './api/UserSettingsAPI'
import { setTheme } from './slices/themeSlice'

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const App = () => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectUserLoading)
  const user = useAppSelector(selectUser)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  useEffect(() => {
    if (!user) return

    const initUserSettings = async () => {
      try {
        let theme = await getUserTheme(user.id)

        if (!theme) {
          // theme = 'dark'
          theme = 'halloween'
          await setUserTheme(user.id, theme)
        }

        dispatch(setTheme(theme))
      } catch (err) {
        console.error('Ошибка инициализации пользователя:', err)
      }
    }

    initUserSettings()
  }, [user, dispatch])

  if (isLoading) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Загрузка</title>
          <meta name="description" content="Страница логина" />
        </Helmet>
        <Box className={classes.pageContainer}>
          <Typography variant="h1" className={globalClasses.themedHeader}>
            Загрузка...
          </Typography>
        </Box>
      </>
    )
  }

  return <Router />
}

export default App
