import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ItemCreate, ItemRequest, ItemsRequest } from "./types";
import axios from "axios";

export const getItems = createAsyncThunk(
  "items/getItems",
  async ({ lang, categoryId, limit }: ItemsRequest) => {
    const params = new URLSearchParams();
    if (lang) {
      params.append("lang", lang);
    }
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
  async ({ itemId, lang }: ItemRequest) => {
    const response = await axios.get(
      `http://localhost:8000/api/v1/items/${itemId}?lang=${lang}`,
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
