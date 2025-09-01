import { usePage } from '../hooks/usePage'
import { ErrorLayout } from '../components/Layouts/ErrorLayout'

export const ServerErrorPage = () => {
  usePage({ initPage: initServerErrorPage })

  return (
    <ErrorLayout
      code={500}
      title="Ошибка сервера"
      description="Внутренняя ошибка сервера"
      message="Извините, произошла внутренняя ошибка сервера. Мы уже работаем над её устранением."
    />
  )
}

export const initServerErrorPage = () => Promise.resolve()
