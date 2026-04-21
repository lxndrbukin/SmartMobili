import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse, UserProps } from "./types";
import { register, login, getMe } from "../thunks/auth";

type ApiError = { detail?: string; };

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state: AuthState) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    setError: (state: AuthState, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state: AuthState) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.access_token;
      state.isLoading = false;
      localStorage.setItem("token", action.payload.access_token);

    });
    builder.addCase(register.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(register.rejected, (state: AuthState, action: PayloadAction<ApiError | undefined>) => {
      state.error = action.payload?.detail || "Something went wrong";
      state.isLoading = false;
    });
    builder.addCase(login.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.access_token;
      state.isLoading = false;
      localStorage.setItem("token", action.payload.access_token);
    });
    builder.addCase(login.pending, (state: AuthState) => {
      state.isLoading = true;
    });
    builder.addCase(login.rejected, (state: AuthState, action: PayloadAction<ApiError | undefined>) => {
      state.error = action.payload?.detail || "Something went wrong";
      state.isLoading = false;
    });
    builder.addCase(getMe.fulfilled, (state: AuthState, action: PayloadAction<UserProps>) => {
      state.user = action.payload;
    });
  }
});

export default authSlice.reducer;
export const { logout, setError, clearError } = authSlice.actions;