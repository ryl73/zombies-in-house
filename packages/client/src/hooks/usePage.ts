import { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from '../store'
import {
  setPageHasBeenInitializedOnServer,
  selectPageHasBeenInitializedOnServer,
} from '../slices/ssrSlice'
import { PageInitArgs, PageInitContext } from '../routes'
import { AppError, ErrorCode, useErrorNavigation } from '../utils/errorHandling'

const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

const createContext = (): PageInitContext => ({
  clientToken: getCookie('token'),
})

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown>
}

function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export const usePage = ({ initPage }: PageProps) => {
  const dispatch = useDispatch()
  const navigateToErrorPage = useErrorNavigation()
  const pageHasBeenInitializedOnServer = useSelector(
    selectPageHasBeenInitializedOnServer
  )
  const store = useStore()

  useEffect(() => {
    if (pageHasBeenInitializedOnServer) {
      dispatch(setPageHasBeenInitializedOnServer(false))
      return
    }

    const initializePage = async () => {
      try {
        await initPage({
          dispatch,
          state: store.getState(),
          ctx: createContext(),
        })
      } catch (error) {
        console.error('Инициализация страницы произошла с ошибкой', error)

        let errorCode = ErrorCode.SERVER_ERROR
        let errorMessage = 'Неизвестная ошибка'

        if (isAppError(error)) {
          errorCode = error.status as ErrorCode
          errorMessage = error.message
        } else if (error instanceof Error) {
          errorMessage = error.message
        }

        navigateToErrorPage(errorCode, errorMessage)
      }
    }

    initializePage()
  }, [dispatch, initPage, pageHasBeenInitializedOnServer, store])
}
