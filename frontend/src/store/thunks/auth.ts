import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { UserUpdate } from "./types";
import { API_URL } from "../../api";

type AuthCredentials = { username: string; password: string; };
type AuthResponse = { access_token: string; token_type: string; };
type ApiError = { detail?: string; };

function getApiErrorDetail(err: unknown): string | undefined {
  if (!axios.isAxiosError(err)) return undefined;
  const data = err.response?.data as unknown;
  if (data && typeof data === "object" && "detail" in data) {
    const detail = (data as { detail?: unknown; }).detail;
    return typeof detail === "string" ? detail : undefined;
  }
  return undefined;
}

export const register = createAsyncThunk<AuthResponse, AuthCredentials, { rejectValue: ApiError; }>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/register`, data);
      return response.data as AuthResponse;
    } catch (err) {
      return rejectWithValue({ detail: getApiErrorDetail(err) ?? "Something went wrong" });
    }
  },
);

export const login = createAsyncThunk<AuthResponse, AuthCredentials, { rejectValue: ApiError; }>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, data);
      return response.data as AuthResponse;
    } catch (err) {
      return rejectWithValue({ detail: getApiErrorDetail(err) ?? "Something went wrong" });
    }
  },
);

export const getMe = createAsyncThunk("auth/getMe", async () => {
  const response = await axios.get(`${API_URL}/api/v1/auth/users/me`);
  return response.data;
});

export const getUsers = createAsyncThunk("auth/getUsers", async () => {
  const response = await axios.get(`${API_URL}/api/v1/auth/users`);
  return response.data;
});

export const getUser = createAsyncThunk("auth/getUser", async (userId: Number) => {
  const response = await axios.get(`${API_URL}/api/v1/auth/${userId}`);
  return response.data;
});

export const updateUser = createAsyncThunk("auth/updateUser", async (data: UserUpdate) => {
  const response = await axios.put(`${API_URL}/api/v1/auth/${data.id}`);
  return response.data;
});

export const deleteUser = createAsyncThunk("auth/deleteUser", async (userId: Number) => {
  await axios.delete(`${API_URL}/api/v1/auth/users/${userId}`);
  return userId;
});