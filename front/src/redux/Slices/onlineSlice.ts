import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitial {
  me_online: boolean;
  users_online: string[];
}

const initialState: IInitial = {
  me_online: false,
  users_online: [],
};

export const onlineSlice = createSlice({
  name: "online",
  initialState,
  reducers: {
    setMeOnline: (state, action: PayloadAction<boolean>) => {
      state.me_online = action.payload;
    },
    setUsersOnline: (state, action: PayloadAction<string[]>) => {
      state.users_online = action.payload;
    },
  },
});

export const OnlineActions = {
  ...onlineSlice.actions,
};
