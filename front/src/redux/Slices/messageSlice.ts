import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";

import { errorHandle } from "../../helpers/error-handle";
import IMessage from "../../interfaces/IMessage";
import IMessageEdit from "../../interfaces/IMessageEdit";
import { api } from "../../services/messenger.api.service";

interface IInitial {
  messageOnEdit: IMessage | null;
  filesToDelete: string[];
  messages: IMessage[];
  loadingState: boolean;
}

const initialState: IInitial = {
  messageOnEdit: null,
  filesToDelete: [],
  messages: [],
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

const editMessage = createAsyncThunk(
  "messages/editMessage",
  async ({ content, filesToDelete, id }: IMessageEdit, thunkAPI) => {
    try {
      const dto = { content, filesToDelete };
      const messageUpdated = await api.message.edit(id, dto);
      thunkAPI.dispatch(MessageActions.clearFilesToDelete());
      thunkAPI.dispatch(MessageActions.setMessageOnEdit(null));
      return thunkAPI.fulfillWithValue(messageUpdated);
    } catch (e) {
      const error = errorHandle(e);
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(MessageActions.setLoadingState(false));
    }
  }
);

const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (id: string, thunkAPI) => {
    try {
      await api.message.delete(id);
      return thunkAPI.fulfillWithValue(id);
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
    clearFilesToDelete: (state) => {
      state.filesToDelete = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.messages = [...state.messages].map((m) =>
          m.id === action.payload.id ? action.payload : m
        );
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = [...state.messages].filter(
          (m) => m.id !== action.payload
        );
      })
      .addMatcher(
        isRejected(getMessages, editMessage, deleteMessage),
        (state, action) => {
          console.error(
            "Messages receive sequence failed with error:",
            action.payload
          );
        }
      )
      .addMatcher(
        isPending(getMessages, editMessage, deleteMessage),
        (state) => {
          state.loadingState = true;
        }
      );
  },
});

export const MessageActions = {
  ...messageSlice.actions,
  getMessages,
  editMessage,
  deleteMessage,
};
