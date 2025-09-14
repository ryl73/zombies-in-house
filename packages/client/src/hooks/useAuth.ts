import { useEffect } from 'react'
import {
  setUser,
  User,
  fetchUserThunk,
  clearUser as cl,
  isUserLoggedIn,
  selectUserLoading,
} from '../slices/userSlice'
import { useAppDispatch, useAppSelector } from './useApp'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(isUserLoggedIn)
  const isLoading = useAppSelector(selectUserLoading)

  useEffect(() => {
    if (isLoading) {
      dispatch(fetchUserThunk())
    }
  }, [dispatch, isLoading])

  const setAuthUser = (user: User) => {
    dispatch(setUser(user))
  }

  const clearUser = () => {
    dispatch(cl())
  }

  const checkAuth = () => {
    return isLoggedIn
  }

  return {
    isLoggedIn,
    isLoading,
    setAuthUser,
    clearUser,
    checkAuth,
  }
}
