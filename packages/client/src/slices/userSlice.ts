import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getUser } from '../api/LoginAPI'

interface User {
  id: number
  first_name: string
  second_name: string
  display_name: string
  phone: string
  login: string
  avatar: string
  email: string
}

export interface UserState {
  data: User | null
  isLoading: boolean
  error: any
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
}

interface ApiError {
  message: string
  code?: number
  details?: unknown
}

export const fetchUserThunk = createAsyncThunk<
  User,
  void,
  {
    rejectValue: ApiError
  }
>('user/fetchUserThunk', async (_, { rejectWithValue }) => {
  try {
    const userInfo = await getUser()
    return userInfo
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || 'Unknown error',
      code: error.response?.status,
      details: error.response?.data,
    }

    return rejectWithValue(apiError)
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserThunk.pending, state => {
        state.data = null
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchUserThunk.fulfilled,
        (state, { payload }: PayloadAction<User>) => {
          state.data = payload
          state.isLoading = false
        }
      )
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const selectUser = (state: RootState) => state.user.data

export default userSlice.reducer
