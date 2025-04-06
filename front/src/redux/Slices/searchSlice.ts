import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { initialQuery } from '../../constants/initialQuery'
import IQuery from '../../interfaces/IQuery'

interface IInitial {
  query: IQuery
}

const initialState: IInitial = {
  query: initialQuery,
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<IQuery>) => {
      state.query = action.payload
    },
  },
})

export const SearchActions = {
  ...searchSlice.actions,
}
