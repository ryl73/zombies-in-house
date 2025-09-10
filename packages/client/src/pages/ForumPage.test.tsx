import { render, screen } from '@testing-library/react'
import { ForumPage } from './ForumPage'
import { Provider } from 'react-redux'
import { store } from '../store'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from '../theme/theme'

// @ts-ignore
global.fetch = jest.fn(() => Promise.resolve({}))

test('Example test', async () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ForumPage />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  )
  const forumTexts = screen.getAllByText(/Форум/i)
  expect(forumTexts.length).toBeGreaterThan(0)
})
