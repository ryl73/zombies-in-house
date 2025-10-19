import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForumPage } from './ForumPage'
import { Provider } from 'react-redux'
import { reducer } from '../store'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProviderCustom } from '../theme/ThemeContext'
import { ReactNode } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { forumAPI } from '../api/forumAPI'

// ====== MOCKS ======

jest.mock('../hooks/usePage', () => ({
  usePage: jest.fn(),
}))

jest.mock('../api/forumAPI', () => ({
  forumAPI: {
    getTopics: jest.fn(),
    getComments: jest.fn(),
  },
}))

jest.mock('uuid', () => ({
  v4: () => `test-uuid-${Date.now()}`,
}))

console.error = jest.fn()
console.log = jest.fn()

// ====== TEST UTILS ======

export const renderWithProviders = (
  ui: ReactNode,
  withRoutes = false,
  customStore = configureStore({ reducer })
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

// ====== MOCK DATA ======

const mockTopics = [
  { id: '1', title: 'Zombie Survival Tips' },
  { id: '2', title: 'Best Weapons' },
]

// ====== TESTS ======

describe('ForumPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loader while fetching topics', async () => {
    ;(forumAPI.getTopics as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
          console.log('fetching topics')
        }) // unresolved promise simulating loading
    )

    renderWithProviders(<ForumPage />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders empty state when no topics returned', async () => {
    ;(forumAPI.getTopics as jest.Mock).mockResolvedValue({
      success: true,
      data: { data: [], pagination: { page: 1, pageCount: 1, total: 0 } },
    })

    renderWithProviders(<ForumPage />)

    await waitFor(() =>
      expect(screen.getByText(/Пока нет топиков/i)).toBeInTheDocument()
    )
    expect(screen.getByText(/Создать первый топик/i)).toBeInTheDocument()
  })

  it('renders topics and pagination when API returns data', async () => {
    ;(forumAPI.getTopics as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        data: mockTopics,
        pagination: { page: 1, pageCount: 2, total: 2 },
      },
    })
    ;(forumAPI.getComments as jest.Mock).mockResolvedValue({
      success: true,
      data: { pagination: { total: 3 } },
    })

    renderWithProviders(<ForumPage />)

    await waitFor(() =>
      expect(screen.getAllByTestId('topic-item')).toHaveLength(2)
    )

    expect(screen.getAllByTestId('pagination')[0]).toBeInTheDocument()
    expect(screen.getByText('Zombie Survival Tips')).toBeInTheDocument()
    expect(screen.getByText('Best Weapons')).toBeInTheDocument()
  })

  it('handles page change and triggers reload', async () => {
    ;(forumAPI.getTopics as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        data: mockTopics,
        pagination: { page: 1, pageCount: 2, total: 2 },
      },
    })
    ;(forumAPI.getComments as jest.Mock).mockResolvedValue({
      success: true,
      data: { pagination: { total: 2 } },
    })

    renderWithProviders(<ForumPage />)

    await waitFor(() => screen.getAllByTestId('pagination')[1])
    fireEvent.click(screen.getAllByTestId('pagination')[1])

    await waitFor(() =>
      expect(forumAPI.getTopics).toHaveBeenLastCalledWith({
        page: 2,
        limit: 10,
      })
    )
  })

  it('navigates to create topic page on button click', async () => {
    ;(forumAPI.getTopics as jest.Mock).mockResolvedValue({
      success: true,
      data: { data: [], pagination: { page: 1, pageCount: 1, total: 0 } },
    })

    const user = userEvent.setup()
    renderWithProviders(<ForumPage />, true)

    await waitFor(() => screen.getByText(/Создать топик/i))
    const createButton = screen.getAllByText(/Создать топик/i)[0]
    await user.click(createButton)

    expect(screen.getByText(/Create Page/i)).toBeInTheDocument()
  })

  it('navigates to topic page on topic click', async () => {
    ;(forumAPI.getTopics as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        data: mockTopics,
        pagination: { page: 1, pageCount: 1, total: 2 },
      },
    })
    ;(forumAPI.getComments as jest.Mock).mockResolvedValue({
      success: true,
      data: { pagination: { total: 1 } },
    })

    const user = userEvent.setup()
    renderWithProviders(<ForumPage />, true)

    await waitFor(() => screen.getAllByTestId('topic-link'))
    await user.click(screen.getAllByTestId('topic-link')[0])

    expect(screen.getByText(/Topic Page/i)).toBeInTheDocument()
  })

  it('handles API failure gracefully', async () => {
    ;(forumAPI.getTopics as jest.Mock).mockRejectedValue(
      new Error('network error')
    )

    renderWithProviders(<ForumPage />)

    await waitFor(() =>
      expect(screen.getByText(/Пока нет топиков/i)).toBeInTheDocument()
    )
  })
})
