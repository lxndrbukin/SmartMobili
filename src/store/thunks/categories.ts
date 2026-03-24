import { createAsyncThunk } from "@reduxjs/toolkit";
import { type CategoryCreate } from "./types";
import axios from "axios";

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    const response = await axios.get("http://localhost:8000/api/v1/categories");
    return response.data;
  },
);

export const createCategory = createAsyncThunk(
  "catalog/createCategory",
  async (data: CategoryCreate) => {
    const response = await axios.post(
      "http://localhost:8000/api/v1/categories",
      data,
    );
    return response.data;
  },
);
