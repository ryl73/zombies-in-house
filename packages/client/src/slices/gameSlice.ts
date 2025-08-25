import { createSlice } from '@reduxjs/toolkit'

const gameSlice = createSlice({
  name: 'game',
  initialState: { version: 0 },
  reducers: {
    forceUpdate: state => {
      state.version++
    },
  },
})

export const { forceUpdate } = gameSlice.actions
export default gameSlice.reducer
