import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit'

import { errorHandle } from '../../helpers/error-handle'
import IUser from '../../interfaces/IUser'
import { api } from '../../services/messenger.api.service'

interface IInitial {
  userLogged: IUser | null
  contactChosen: IUser | null
  users: IUser[]
  usersLoadingState: boolean
}

const initialState: IInitial = {
  userLogged: null,
  contactChosen: null,
  users: [],
  usersLoadingState: false,
}
const getAllUsers = createAsyncThunk('users/getAllUsers', async (_, thunkAPI) => {
  try {
    const users = await api.user.all()
    return thunkAPI.fulfillWithValue(
      users.map((e) => ({
        ...e,
        last_visit: e.last_visit
          ? new Date(e.last_visit).toLocaleString('uk-UA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Kyiv',
            })
          : 'null',
      })),
    )
  } catch (e) {
    const error = errorHandle(e)
    return thunkAPI.rejectWithValue(error.message)
  } finally {
    thunkAPI.dispatch(UsersActions.setLoadingState(false))
  }
})

const getMe = createAsyncThunk('users/getMe', async (_, thunkAPI) => {
  try {
    const me = await api.user.me()
    return thunkAPI.fulfillWithValue({
      ...me,
      last_visit: me.last_visit
        ? new Date(me.last_visit).toLocaleString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Kyiv',
          })
        : 'null',
    })
  } catch (e) {
    const error = errorHandle(e)
    return thunkAPI.rejectWithValue(error.message)
  } finally {
    thunkAPI.dispatch(UsersActions.setLoadingState(false))
  }
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.userLogged = action.payload
    },
    setContactChosen: (state, action: PayloadAction<IUser | null>) => {
      state.contactChosen = action.payload
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.usersLoadingState = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.userLogged = action.payload
      })
      .addMatcher(isRejected(getAllUsers, getMe), (state, action) => {
        console.error('Users receive sequence failed with error:', action.payload)
      })
      .addMatcher(isPending(getAllUsers, getMe), (state) => {
        state.usersLoadingState = true
      })
  },
})

export const UsersActions = {
  ...usersSlice.actions,
  getAllUsers,
  getMe,
}
