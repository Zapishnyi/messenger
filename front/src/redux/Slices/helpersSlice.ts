import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IInitial {
  isUsersOnFocus: boolean
}

const initialState: IInitial = {
  isUsersOnFocus: false,
}

export const helpersSlice = createSlice({
  name: 'helpers',
  initialState,
  reducers: {
    setUsersOnFocus: (state, action: PayloadAction<boolean>) => {
      state.isUsersOnFocus = action.payload
    },
  },
})

export const HelpersActions = {
  ...helpersSlice.actions,
}
