import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type AdminState,
  type PaginatedUsersResponse,
  type PaginatedInquiriesResponse,
  type UserProps,
  type InquiryProps
} from "./types";
import { getUsers, deleteUser, getUser, updateUser } from "../thunks/auth";
import { getInquiries, deleteInquiry, updateInquiry } from "../thunks/inquiries";

const initialState: AdminState = {
  users: {
    data: [],
    pagination: null,
    currentUser: null
  },
  inquiries: {
    data: [],
    pagination: null,
    currentInquiry: null
  }
};

const adminState = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state: AdminState, action: PayloadAction<PaginatedUsersResponse>) => {
      state.users = { ...state.users, ...action.payload };
    });
    builder.addCase(getUsers.pending, (state: AdminState) => {
      state.users = { data: [], pagination: null, currentUser: null };
    });
    builder.addCase(getUser.fulfilled, (state: AdminState, action: PayloadAction<UserProps>) => {
      state.users.currentUser = action.payload;
    });
    builder.addCase(updateUser.fulfilled, (state: AdminState, action: PayloadAction<UserProps>) => {
      const updatedUser = action.payload;

      const index = state.users.data.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        state.users.data[ index ] = updatedUser;
      }
    });
    builder.addCase(deleteUser.fulfilled, (state: AdminState, action: PayloadAction<Number>) => {
      state.users.data = state.users.data.filter((user) => user.id !== action.payload);
    });
    builder.addCase(getInquiries.fulfilled, (state: AdminState, action: PayloadAction<PaginatedInquiriesResponse>) => {
      state.inquiries = { ...state.inquiries, ...action.payload };
    });
    builder.addCase(getInquiries.pending, (state: AdminState) => {
      state.inquiries = { data: [], pagination: null, currentInquiry: null };
    });
    builder.addCase(updateInquiry.fulfilled, (state: AdminState, action: PayloadAction<InquiryProps>) => {
      const updatedInquiry = action.payload;

      const index = state.inquiries.data.findIndex(u => u.id === updatedInquiry.id);
      if (index !== -1) {
        state.inquiries.data[ index ] = updatedInquiry;
      }
    });
    builder.addCase(deleteInquiry.fulfilled, (state: AdminState, action: PayloadAction<number>) => {
      state.inquiries.data = state.inquiries.data.filter(inquiry => inquiry.id !== action.payload);
    });
  }
});

export default adminState.reducer;