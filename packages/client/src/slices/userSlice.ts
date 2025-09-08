import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getUser, UserResponse } from '../api/UserAPI'

export interface UserState {
  data: UserResponse | null
  isLoading: boolean
}

const initialState: UserState = {
  data: null,
  isLoading: true,
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async (_, { rejectWithValue }) => {
    try {
      return await getUser()
    } catch (e) {
      return rejectWithValue('Ошибка загрузки')
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserResponse>) => {
      state.data = action.payload
    },
    clearUser: state => {
      state.data = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserThunk.pending, state => {
        state.data = null
        state.isLoading = true
      })
      .addCase(
        fetchUserThunk.fulfilled,
        (state, { payload }: PayloadAction<UserResponse>) => {
          state.data = payload
          state.isLoading = false
        }
      )
      .addCase(fetchUserThunk.rejected, state => {
        state.isLoading = false
      })
  },
})

export const { setUser, clearUser } = userSlice.actions
export const isUserLoggedIn = (state: RootState) => !!state.user.data
export const selectUser = (state: RootState) => state.user.data
export const selectUserLoading = (state: RootState) => state.user.isLoading

export default userSlice.reducer
