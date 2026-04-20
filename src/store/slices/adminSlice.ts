import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AdminState, type PaginatedUsersResponse, type PaginatedInquiriesResponse } from "./types";
import { getUsers } from "../thunks/auth";
import { getInquiries } from "../thunks/inquiries";

const initialState: AdminState = {
  users: {
    data: [],
    pagination: null
  },
  inquiries: {
    data: [],
    pagination: null
  }
};

const adminState = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state: AdminState, action: PayloadAction<PaginatedUsersResponse>) => {
      state.users = action.payload;
    });
    builder.addCase(getInquiries.fulfilled, (state: AdminState, action: PayloadAction<PaginatedInquiriesResponse>) => {
      state.inquiries = action.payload;
    });
  }
});

export default adminState.reducer;