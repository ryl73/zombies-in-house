import { AppDispatch, useSelector } from './store'
import { fetchUserThunk, selectUserLoading } from './slices/userSlice'
import { useDispatch } from 'react-redux'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { PageContainer } from './styles/PageContainer'
import { ThemedHeader } from './styles/ThemedHeader'
import Router from './Router'

const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector(selectUserLoading)

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [])

  if (isLoading) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Вход</title>
          <meta name="description" content="Страница логина" />
        </Helmet>
        <PageContainer>
          <ThemedHeader>Загрузка...</ThemedHeader>
        </PageContainer>
      </>
    )
  }

  return <Router />
}

export default App
