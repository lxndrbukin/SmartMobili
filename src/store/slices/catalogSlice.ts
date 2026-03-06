import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CatalogState, ItemProps } from "./types";
import { getItems } from "../thunks/items";

const initialState: CatalogState = {
  catalog: [],
  currentItem: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getItems.fulfilled,
      (state: CatalogState, action: PayloadAction<Array<ItemProps>>) => {
        state.catalog = action.payload;
      },
    );
  },
});

export default catalogSlice.reducer;
