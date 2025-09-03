import { usePage } from '../hooks/usePage'
import { ErrorLayout } from '../components/Layouts/ErrorLayout'

export const NotFoundPage = () => {
  usePage({ initPage: initNotFoundPage })

  return (
    <ErrorLayout
      code={404}
      title="Страница не найдена"
      description="Запрашиваемая страница не существует"
      message="Упс! Попробуйте вернуться назад"
    />
  )
}

export const initNotFoundPage = () => Promise.resolve()
