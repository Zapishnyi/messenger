import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import { helpersSlice } from './Slices/helpersSlice'
import { messageSlice } from './Slices/messageSlice'
import { onlineSlice } from './Slices/onlineSlice'
import { searchSlice } from './Slices/searchSlice'
import { usersSlice } from './Slices/usersSlice'

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
    messages: messageSlice.reducer,
    online: onlineSlice.reducer,
    search: searchSlice.reducer,
    helpers: helpersSlice.reducer,
  },
})

export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>()

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()
export type RootState = ReturnType<typeof store.getState>
