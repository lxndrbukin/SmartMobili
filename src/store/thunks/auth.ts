import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../api";

export const register = createAsyncThunk(
  "auth/register",
  async (data: { username: string; password: string; }) => {
    const response = await axios.post(`${API_URL}/api/v1/auth/register`, data);
    return response.data.access_token;
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: { username: string; password: string; }) => {
    const response = await axios.post(`${API_URL}/api/v1/auth/login`, data);
    return response.data.access_token;
  },
);

export const getMe = createAsyncThunk("auth/getMe", async () => {
  const response = await axios.get(`${API_URL}/api/v1/auth/users/me`);
  return response.data;
});