import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForumPage } from './ForumPage'
import { Provider } from 'react-redux'
import { store } from '../store'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from '../theme/theme'
import { ReactNode } from 'react'
import { mockTopics } from '../components/Forum/TopicItem'

// @ts-ignore
global.fetch = jest.fn(() => Promise.resolve({}))

export const renderWithProviders = (ui: ReactNode, withRoutes = false) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/forum']}>
          {withRoutes ? (
            <Routes>
              <Route path="/forum" element={ui} />
              <Route path="/forum/create" element={<div>Create Page</div>} />
              <Route path="/forum/topic/:id" element={<div>Topic Page</div>} />
            </Routes>
          ) : (
            ui
          )}
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  )

describe('ForumPage', () => {
  test('renders the main heading', () => {
    renderWithProviders(<ForumPage />)
    expect(
      screen.getByRole('heading', { name: /^Форум$/, level: 1 })
    ).toBeTruthy()
  })

  test('displays all mock topics by default', () => {
    renderWithProviders(<ForumPage />)
    mockTopics.forEach(topic => {
      expect(screen.getByText(topic.title)).toBeTruthy()
    })
  })

  test('filters topics when typing in the search field', () => {
    renderWithProviders(<ForumPage />)
    const searchInput = screen.getByPlaceholderText(/Поиск по форуму/i)

    fireEvent.change(searchInput, { target: { value: mockTopics[0].title } })

    expect(screen.getByText(mockTopics[0].title)).toBeTruthy()

    mockTopics.slice(1).forEach(topic => {
      expect(screen.queryByText(topic.title)).toBeNull()
    })
  })

  test('shows "Ничего не найдено" for no matches', () => {
    renderWithProviders(<ForumPage />)
    const searchInput = screen.getByPlaceholderText(/Поиск по форуму/i)
    fireEvent.change(searchInput, { target: { value: 'не существует' } })

    expect(screen.getByText(/Ничего не найдено/i)).toBeTruthy()
    expect(
      screen.getByText(/Попробуйте изменить поисковый запрос/i)
    ).toBeTruthy()
  })

  test('navigates to create topic page on button click', async () => {
    const user = userEvent.setup()

    renderWithProviders(<ForumPage />, true)

    const createLink = screen.getByText(/Создать топик/i)
    await user.click(createLink)

    expect(screen.getByText(/Create Page/i)).toBeTruthy()
  })

  test('navigates to topic page on topic card click', async () => {
    const user = userEvent.setup()

    renderWithProviders(<ForumPage />, true)

    const topicLinks = screen.getAllByTestId('topic-link')
    await user.click(topicLinks[0])

    expect(screen.getByText(/Topic Page/i)).toBeTruthy()
  })
})
