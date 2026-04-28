import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ItemCreate,
  ItemRequest,
  ItemUpdate,
  ItemsRequest,
  ItemImageUpdate,
} from "./types";
import axios from "axios";
import { API_URL } from "../../api";

export const getItems = createAsyncThunk(
  "items/getItems",
  async ({ lang, categoryId, desc, categorySlug, searchQuery, limit }: ItemsRequest) => {
    const params = new URLSearchParams();
    if (desc) {
      params.append("desc", desc.toString());
    }
    if (lang) {
      params.append("lang", lang);
    }
    if (categoryId) {
      params.append("category_id", categoryId.toString());
    }
    if (categorySlug) {
      params.append("category_slug", categorySlug.toString());
    }
    if (searchQuery) {
      params.append("search_query", searchQuery.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }
    const response = await axios.get(
      `${API_URL}/api/v1/items?${params}`,
    );
    return response.data.data;
  },
);
export const getItem = createAsyncThunk(
  "items/getItem",
  async ({ itemId, lang }: ItemRequest) => {
    const response = await axios.get(
      `${API_URL}/api/v1/items/${itemId}?lang=${lang}`,
    );
    return response.data;
  },
);

export const createItem = createAsyncThunk(
  "items/createItem",
  async (data: ItemCreate) => {
    const response = await axios.post(
      `${API_URL}/api/v1/items`,
      data,
    );
    return response.data;
  },
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async (data: ItemUpdate) => {
    await axios.put(`${API_URL}/api/v1/items/${data.id}`, {
      price: data.price,
      category_id: data.category_id,
    });

    if (data.translations) {
      for (const translation of data.translations) {
        const { language, title, description } = translation;
        await axios.put(
          `${API_URL}/api/v1/items/${data.id}/translations?lang=${language}`,
          { title, description },
        );
      }
    }
    const lang = localStorage.getItem("language") || "ro";
    const response = await axios.get(
      `${API_URL}/api/v1/items/${data.id}?lang=${lang}`,
    );
    return response.data;
  },
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (itemId: number) => {
    await axios.delete(`${API_URL}/api/v1/items/${itemId}`);
    return;
  },
);

export const addItemImage = createAsyncThunk(
  "items/updateImage",
  async (data: ItemImageUpdate) => {
    await fetch(`${API_URL}/api/v1/items/${data.itemId}/images`, {
      method: "POST",
      body: data.image,
    });
  },
);

export const deleteItemImage = createAsyncThunk(
  "items/deleteImage",
  async (data: { itemId: number; imageId: number; }) => {
    await axios.delete(
      `${API_URL}/api/v1/items/${data.itemId}/images/${data.imageId}`,
    );
  },
);
