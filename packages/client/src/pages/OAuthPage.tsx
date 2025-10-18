import { PageInitArgs } from '../routes'
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/userSlice'
import { getUser } from '../api/UserAPI'
import { signInWithYandex } from '../api/OAuthAPI'
import { useNotification } from '../hooks/useNotification'

export const OAuthPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showError } = useNotification()

  useEffect(() => {
    const code = searchParams.get('code')

    const redirectUri = `${window.location.origin}/oauth`

    if (code) {
      signInWithYandex(code, redirectUri)
        .then(getUser)
        .then(user => {
          dispatch(setUser(user))
          navigate('/')
        })
        .catch(err => {
          showError('Ошибка авторизации через Яндекс: ', err)
          navigate('/signin')
        })
    } else {
      showError('Не получен код авторизации')
      navigate('/signin')
    }
  }, [dispatch, navigate, searchParams, showError])

  return <div>Обработка авторизации...</div>
}

export const initOAuthPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
