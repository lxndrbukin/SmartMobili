import { createAsyncThunk } from "@reduxjs/toolkit";

export const getItems = createAsyncThunk("items/getItems", async () => {
  const response = await fetch("/items");
  const data = response.json();
  return data;
});
