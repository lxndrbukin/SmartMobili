import { createAsyncThunk } from "@reduxjs/toolkit";
import { type ItemCreate } from "./types";
import axios from "axios";

export const getItems = createAsyncThunk(
  "items/getItems",
  async ({
    lang,
    categoryId,
    limit,
  }: {
    lang: string;
    categoryId?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams({ lang });
    if (categoryId) {
      params.append("category_id", categoryId.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }
    const response = await axios.get(
      `http://localhost:8000/api/v1/items?${params}`,
    );
    return response.data.data;
  },
);
export const getItem = createAsyncThunk(
  "items/getItem",
  async (data: { itemId: number; lang: string | undefined }) => {
    const response = await axios.get(
      `http://localhost:8000/api/v1/items/${data.itemId}?lang=${data.lang}`,
    );
    return response.data;
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
