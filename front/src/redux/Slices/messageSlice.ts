import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";

import { errorHandle } from "../../helpers/error-handle";
import IMessage from "../../interfaces/IMessage";
import { api } from "../../services/messenger.api.service";

interface IInitial {
  messageOnEdit: IMessage | null;
  filesToDelete: string[];
  messages: IMessage[];
  unreadMessages: IMessage[];
  loadingState: boolean;
}

const initialState: IInitial = {
  messageOnEdit: null,
  filesToDelete: [],
  messages: [],
  unreadMessages: [],
  loadingState: false,
};
const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (receiver_id: string, thunkAPI) => {
    try {
      const messages = await api.message.all(receiver_id);
      const messagesSorted = [...messages].sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
      return thunkAPI.fulfillWithValue(messagesSorted);
    } catch (e) {
      const error = errorHandle(e);
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(MessageActions.setLoadingState(false));
    }
  }
);



export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages = [...state.messages, action.payload];
    },

    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loadingState = action.payload;
    },
    setMessageOnEdit: (state, action: PayloadAction<IMessage | null>) => {
      state.messageOnEdit = action.payload;
    },
    addFileToDelete: (state, action: PayloadAction<string>) => {
      state.filesToDelete = [...state.filesToDelete, action.payload];
    },
    addUnreadMessage: (state, action: PayloadAction<IMessage>) => {
      state.unreadMessages = [...state.unreadMessages, action.payload];
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = [...state.messages].filter(
          (m) => m.id !== action.payload
      );
      
    },
    editMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages = [...state.messages].map(
          (m) => m.id === action.payload.id?action.payload:m
      );
      
    },
   
    filterUnreadMessages: (state, action: PayloadAction<string>) => {
      state.unreadMessages = state.unreadMessages.filter(
        (m) => m.sender_id !== action.payload
      )
    },
    clearFilesToDelete: (state) => {
      state.filesToDelete = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
               .addMatcher(
        isRejected(getMessages),
        (state, action) => {
          console.error(
            "Messages receive sequence failed with error:",
            action.payload
          );
        }
      )
      .addMatcher(
        isPending(getMessages),
        (state) => {
          state.loadingState = true;
        }
      );
  },
});

export const MessageActions = {
  ...messageSlice.actions,
  getMessages,

};
