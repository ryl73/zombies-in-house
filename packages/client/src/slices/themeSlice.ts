import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { setUserTheme } from '../api/UserSettingsAPI'
import { ThemeMode } from '../theme/ThemeContext'

interface ThemeState {
  current: ThemeMode
  isLoading: boolean
  error: string | null
}

const initialState: ThemeState = {
  // current: 'dark',
  current: 'halloween',
  isLoading: false,
  error: null,
}

export const updateUserTheme = createAsyncThunk(
  'theme/updateUserTheme',
  async (
    { userId, theme }: { userId: number; theme: ThemeMode },
    { rejectWithValue }
  ) => {
    try {
      await setUserTheme(userId, theme)
      return theme
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to set theme')
    }
  }
)

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.current = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateUserTheme.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        updateUserTheme.fulfilled,
        (state, action: PayloadAction<ThemeMode>) => {
          state.current = action.payload
          state.isLoading = false
        }
      )
      .addCase(updateUserTheme.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setTheme } = themeSlice.actions
export const selectTheme = (state: RootState) => state.theme.current
export const selectThemeLoading = (state: RootState) => state.theme.isLoading

export default themeSlice.reducer
