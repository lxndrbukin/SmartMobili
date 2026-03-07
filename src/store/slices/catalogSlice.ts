import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CatalogState, ItemProps, CategoryProps } from "./types";
import { getItems } from "../thunks/items";
import { getCategories } from "../thunks/categories";

const initialState: CatalogState = {
  items: [],
  currentItem: null,
  categories: [],
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getItems.fulfilled,
      (state: CatalogState, action: PayloadAction<Array<ItemProps>>) => {
        state.items = action.payload;
      },
    );
    builder.addCase(
      getCategories.fulfilled,
      (state: CatalogState, action: PayloadAction<Array<CategoryProps>>) => {
        state.categories = action.payload;
      },
    );
  },
});

export default catalogSlice.reducer;
