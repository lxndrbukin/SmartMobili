import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CategoryCreate, CategoryUpdate } from "./types";
import axios from "axios";
import { API_URL } from "../../api";

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (lang: string | undefined) => {
    const params = new URLSearchParams();
    if (lang) {
      params.append("lang", lang);
    }
    const response = await axios.get(
      `${API_URL}/api/v1/categories?${params}`,
    );
    return response.data;
  },
);

export const createCategory = createAsyncThunk(
  "catalog/createCategory",
  async (data: CategoryCreate) => {
    const response = await axios.post(
      `${API_URL}/api/v1/categories`,
      data,
    );
    return response.data;
  },
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (data: CategoryUpdate) => {
    await axios.put(`${API_URL}/api/v1/categories/${data.id}`, data);
    if (data.translations) {
      for (const translation of data.translations) {
        const { language, name } = translation;
        await axios.put(
          `${API_URL}/api/v1/categories/${data.id}/translations?lang=${language}`,
          { name },
        );
      }
    }
    const lang = localStorage.getItem("language") || "ro";
    const response = await axios.get(
      `${API_URL}/api/v1/categories/${data.id}?lang=${lang}`,
    );
    return response.data;
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId: number) => {
    await axios.delete(`${API_URL}/api/v1/categories/${categoryId}`);
    return;
  },
);
