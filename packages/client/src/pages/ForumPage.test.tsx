import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForumPage } from './ForumPage'
import { Provider } from 'react-redux'
import { reducer } from '../store'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ReactNode } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { mockTopics } from '../utils/mockData'
import { ThemeProviderCustom } from '../theme/ThemeContext'

jest.mock('../assets/bg-halloween.png', () => 'bg-halloween.png')

export const renderWithProviders = (
  ui: ReactNode,
  withRoutes = false,
  customStore = configureStore({ reducer: reducer })
) =>
  render(
    <Provider store={customStore}>
      <ThemeProviderCustom>
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
      </ThemeProviderCustom>
    </Provider>
  )

describe('ForumPage', () => {
  test('renders the main heading', () => {
    renderWithProviders(<ForumPage />)
    expect(
      screen.getByRole('heading', { name: /^Форум$/, level: 1 })
    ).toBeInTheDocument()
  })

  test('displays all mock topics by default', () => {
    renderWithProviders(<ForumPage />)
    mockTopics.forEach(topic => {
      expect(screen.getByText(topic.title)).toBeInTheDocument()
    })
  })

  test('filters topics when typing in the search field', async () => {
    renderWithProviders(<ForumPage />)
    const searchInput = screen.getByPlaceholderText(/Поиск по форуму/i)
    await userEvent.type(searchInput, mockTopics[0].title)

    expect(screen.getByText(mockTopics[0].title)).toBeInTheDocument()

    mockTopics.slice(1).forEach(topic => {
      expect(screen.queryByText(topic.title)).not.toBeInTheDocument()
    })
  })

  test('shows "Ничего не найдено" for no matches', async () => {
    renderWithProviders(<ForumPage />)
    const searchInput = screen.getByPlaceholderText(/Поиск по форуму/i)
    await userEvent.type(searchInput, 'не существует')

    expect(screen.getByText(/Ничего не найдено/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Попробуйте изменить поисковый запрос/i)
    ).toBeInTheDocument()
  })

  test('navigates to create topic page on button click', async () => {
    const user = userEvent.setup()

    renderWithProviders(<ForumPage />, true)

    const createLink = screen.getByText(/Создать топик/i)
    await user.click(createLink)

    expect(screen.getByText(/Create Page/i)).toBeInTheDocument()
  })

  test('navigates to topic page on topic card click', async () => {
    const user = userEvent.setup()

    renderWithProviders(<ForumPage />, true)

    const topicLinks = screen.getAllByTestId('topic-link')
    await user.click(topicLinks[0])

    expect(screen.getByText(/Topic Page/i)).toBeInTheDocument()
  })
})
