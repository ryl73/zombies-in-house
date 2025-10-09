import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getUser } from '../api/UserAPI'

export interface User {
  id: number
  firstName: string
  secondName: string
  displayName: string
  login: string
  email: string
  phone: string
  avatar: string
}

export interface UserState {
  data: User | null
  isLoading: boolean
  error: any
}

const initialState: UserState = {
  data: null,
  isLoading: true,
  error: null,
}

interface ApiError {
  message: string
  code?: number
  details?: unknown
}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getUser()
    } catch (error: any) {
      const apiError: ApiError = {
        message:
          error.response?.data?.message || error.message || 'Unknown error',
        code: error.response?.status,
        details: error.response?.data,
      }
      return rejectWithValue(apiError)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload
    },
    clearUser: state => {
      state.data = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.data = null
        state.isLoading = true
      })
      .addCase(
        fetchUser.fulfilled,
        (state, { payload }: PayloadAction<User>) => {
          state.data = payload
          state.isLoading = false
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
        console.error('Ошибка загрузки пользователя:', action.payload)
      })
  },
})

export const { setUser, clearUser } = userSlice.actions
export const isUserLoggedIn = (state: RootState) => !!state.user.data
export const selectUser = (state: RootState) => state.user.data
export const selectUserLoading = (state: RootState) => state.user.isLoading

export default userSlice.reducer
