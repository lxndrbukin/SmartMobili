import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CatalogState, ItemProps, CategoryProps } from "./types";
import { getItems, getItem, createItem, updateItem } from "../thunks/items";
import { getCategories, createCategory, updateCategory } from "../thunks/categories";

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
      getItems.pending,
      (state: CatalogState) => {
        state.items = [];
      },
    );
    builder.addCase(
      getItem.fulfilled,
      (state: CatalogState, action: PayloadAction<ItemProps>) => {
        state.currentItem = action.payload;
      },
    );
    builder.addCase(
      getItem.pending,
      (state: CatalogState) => {
        state.currentItem = null;
      },
    );
    builder.addCase(
      createItem.fulfilled, (state: CatalogState, action: PayloadAction<ItemProps>) => {
        state.items = [ ...state.items, action.payload ];
      }
    );
    builder.addCase(updateItem.fulfilled, (state: CatalogState, action: PayloadAction<ItemProps>) => {
      const updatedItem = action.payload;
      state.currentItem = action.payload;
      const index = state.items.findIndex(i => i.id === updatedItem.id);
      if (index !== -1) {
        state.items[ index ] = updatedItem;
      }
    });
    builder.addCase(
      getCategories.fulfilled,
      (state: CatalogState, action: PayloadAction<Array<CategoryProps>>) => {
        state.categories = action.payload;
      },
    );
    builder.addCase(
      getCategories.pending,
      (state: CatalogState) => {
        state.categories = [];
      },
    );
    builder.addCase(
      createCategory.fulfilled, (state: CatalogState, action: PayloadAction<CategoryProps>) => {
        state.categories.push(action.payload);
      }
    );
    builder.addCase(
      updateCategory.fulfilled, (state: CatalogState, action: PayloadAction<CategoryProps>) => {
        const updatedCategory = action.payload;

        const index = state.categories.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[ index ] = updatedCategory;
        }
      }
    );
  },
});

export default catalogSlice.reducer;
