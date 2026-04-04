import { createSlice } from "@reduxjs/toolkit";
import type { AuthProps, UserProps } from "./types";

const initialState: AuthProps = {
  token: localStorage.getItem("token"),
  user: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}
});

export default authSlice.reducer;