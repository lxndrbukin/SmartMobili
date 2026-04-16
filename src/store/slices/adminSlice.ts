import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AdminState, type UserProps } from "./types";
import { getUsers } from "../thunks/auth";

const initialState: AdminState = {
  users: null,
  orders: null
};

const adminState = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state: AdminState, action: PayloadAction<Array<UserProps>>) => {
      state.users = action.payload;
    });
  }
});

export default adminState.reducer;