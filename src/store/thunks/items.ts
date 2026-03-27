import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ItemCreate,
  ItemRequest,
  ItemUpdate,
  ItemsRequest,
  ItemImageUpdate,
} from "./types";
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

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async (data: ItemUpdate) => {
    const response = await axios.put(
      `http://localhost:8000/api/v1/items/${data.id}`,
      data,
    );
    return response.data;
  },
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (itemId: number) => {
    await axios.delete(`http://localhost:8000/api/v1/items/${itemId}`);
    return;
  },
);

export const addImage = createAsyncThunk(
  "items/updateImage",
  async (data: ItemImageUpdate) => {
    await fetch(`http://localhost:8000/api/v1/items/${data.itemId}/images`, {
      method: "POST",
      body: data.image,
    });
  },
);

export const deleteImage = createAsyncThunk(
  "items/deleteImage",
  async (data: { itemId: number; imageId: number }) => {
    await axios.delete(
      `http://localhost:8000/api/v1/items/${data.itemId}/images/${data.imageId}`,
    );
  },
);
