import { fetchUserThunk, selectUserLoading } from './slices/userSlice'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { PageContainer } from './styles/PageContainer'
import { ThemedHeader } from './styles/ThemedHeader'
import Router from './Router'
import { useAppDispatch, useAppSelector } from './hooks/useApp'

const App = () => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectUserLoading)

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
