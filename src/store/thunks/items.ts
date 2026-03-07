import { createAsyncThunk } from "@reduxjs/toolkit";
import { type ItemCreate } from "./types";
import axios from "axios";

export const getItems = createAsyncThunk("items/getItems", async () => {
  const response = await axios.get("http://localhost:8000/api/v1/items");
  const { data } = response.data;
  return data;
});

export const getItem = createAsyncThunk(
  "items/getItem",
  async (itemId: number) => {
    const response = await axios.get(
      `http://localhost:8000/api/v1items/${itemId}`,
    );
    const { data } = response.data;
    return data;
  },
);

export const createItem = createAsyncThunk(
  "items/createItem",
  async (data: ItemCreate) => {
    const response = await axios.post(
      "http://localhost:8000/api/v1/items",
      data,
    );
    return response.data;
  },
);
