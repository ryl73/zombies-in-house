import { fetchUser, selectUserLoading } from './slices/userSlice'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Router from './Router'
import { useAppDispatch, useAppSelector } from './hooks/useApp'
import './App.css'
import { Box, makeStyles, Typography } from '@material-ui/core'
import { useGlobalStyles } from './styles/mui/GlobalStyles'

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

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

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
