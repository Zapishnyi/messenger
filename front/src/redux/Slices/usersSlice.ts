import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit'

import { errorHandle } from '../../helpers/error-handle'
import { navigateTo } from '../../helpers/navigate-to'
import { objectToParams } from '../../helpers/object-to-params'
import { toUaTimeString } from '../../helpers/to-ua-time-format'
import IContact from '../../interfaces/IContact'
import IQuery from '../../interfaces/IQuery'
import IUser from '../../interfaces/IUser'
import { api } from '../../services/messenger.api.service'
import { RootState } from '../store'

interface IInitial {
  userLogged: IUser | null
  userLoggedContacts: IContact[]
  contactChosen: IContact | null
  users: IUser[]
  usersLoadingState: boolean
  userLoggedLoadingState: boolean
}

const initialState: IInitial = {
  userLogged: null,
  userLoggedContacts: [],
  contactChosen: null,
  users: [],
  usersLoadingState: false,
  userLoggedLoadingState: false,
}
const getUsersByQuery = createAsyncThunk(
  'users/getUsersByQuery',
  async (query: IQuery, thunkAPI) => {
    const state = thunkAPI.getState() as RootState
    const { limit, page, sort, search } = state.search.query
    try {
      const users = await api.user.search(
        objectToParams(query as unknown as Record<string, string | number | boolean>),
      )
      if (
        sort === query.sort &&
        limit === query.limit &&
        search === query.search &&
        page === --query.page
      ) {
        return thunkAPI.fulfillWithValue([
          ...state.users.users,
          ...users.map((e) => ({
            ...e,
            last_visit: e.last_visit ? toUaTimeString(e.last_visit) : 'null',
          })),
        ])
      } else {
        return thunkAPI.fulfillWithValue(
          users.map((e) => ({
            ...e,
            last_visit: e.last_visit ? toUaTimeString(e.last_visit) : 'null',
          })),
        )
      }
    } catch (e) {
      const error = errorHandle(e)
      return thunkAPI.rejectWithValue(error.message)
    } finally {
      thunkAPI.dispatch(UsersActions.setUsersLoadingState(false))
    }
  },
)

const getMe = createAsyncThunk('users/getMe', async (_, thunkAPI) => {
  try {
    const me = await api.user.me()

    if (!me.contacts?.length) {
      navigateTo('/users')
    }
    return thunkAPI.fulfillWithValue({
      ...me,
      last_visit: me.last_visit ? toUaTimeString(me.last_visit) : 'null',
    })
  } catch (e) {
    const error = errorHandle(e)
    return thunkAPI.rejectWithValue(error.message)
  } finally {
    thunkAPI.dispatch(UsersActions.setUserLoggedLoadingState(false))
  }
})

const contactToggle = createAsyncThunk('users/contactToggle', async (user_id: string, thunkAPI) => {
  const state = thunkAPI.getState() as RootState
  const isInContacts = state.users.userLoggedContacts.some((c) => c.id === user_id)
  try {
    const me = isInContacts
      ? await api.user.delete_contact(user_id)
      : await api.user.add_contact(user_id)
    return thunkAPI.fulfillWithValue({
      ...me,
      last_visit: me.last_visit ? toUaTimeString(me.last_visit) : 'null',
    })
  } catch (e) {
    const error = errorHandle(e)
    return thunkAPI.rejectWithValue(error.message)
  } finally {
    // thunkAPI.dispatch(UsersActions.setUserLoggedLoadingState(false))
  }
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoggedUser: (state, action: PayloadAction<IUser | null>) => {
      if (action.payload) {
        const { contacts, ...rest } = action.payload
        state.userLogged =
          JSON.stringify(state.userLogged) === JSON.stringify(rest) ? state.userLogged : rest
        state.userLoggedContacts = contacts || []
      } else {
        state.userLogged = null
        state.userLoggedContacts = []
      }
    },
    clearUsers: (state) => {
      state.users = []
    },
    setContactChosen: (state, action: PayloadAction<IContact | null>) => {
      state.contactChosen = action.payload
    },
    setUsersLoadingState: (state, action: PayloadAction<boolean>) => {
      state.usersLoadingState = action.payload
    },
    setUserLoggedLoadingState: (state, action: PayloadAction<boolean>) => {
      state.userLoggedLoadingState = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersByQuery.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(contactToggle.fulfilled, (state, action) => {
        const { contacts, ...rest } = action.payload
        state.userLogged =
          JSON.stringify(state.userLogged) === JSON.stringify(rest) ? state.userLogged : rest
        state.userLoggedContacts = contacts || []
      })
      .addCase(getMe.fulfilled, (state, action) => {
        const { contacts, ...rest } = action.payload
        state.userLogged =
          JSON.stringify(state.userLogged) === JSON.stringify(rest) ? state.userLogged : rest

        state.userLoggedContacts = contacts || []
      })
      .addMatcher(isRejected(getUsersByQuery, getMe, contactToggle), (state, action) => {
        console.error('Users receive sequence failed with error:', action.payload)
      })
      .addMatcher(isPending(getUsersByQuery), (state) => {
        state.usersLoadingState = true
      })
      .addMatcher(isPending(getMe), (state) => {
        state.userLoggedLoadingState = true
      })
  },
})

export const UsersActions = {
  ...usersSlice.actions,
  getUsersByQuery,
  contactToggle,
  getMe,
}
