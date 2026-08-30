import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CatalogState, ItemProps, CategoryProps, BannerProps } from "./types";
import { getItems, getItem, createItem, updateItem } from "../thunks/items";
import { getCategories, createCategory, updateCategory } from "../thunks/categories";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../thunks/banners";

const initialState: CatalogState = {
  items: [],
  currentItem: null,
  itemNotFound: false,
  categories: [],
  categoriesLoaded: false,
  banners: [],
  bannersLoaded: false,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    clearItems: (state: CatalogState) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getItems.fulfilled,
      (state: CatalogState, action: PayloadAction<Array<ItemProps>>) => {
        state.items = [...state.items, ...action.payload];
      },
    );
    // builder.addCase(
    //   getItems.pending,
    //   (state: CatalogState) => {
    //     state.items = [];
    //   },
    // );
    builder.addCase(
      getItem.fulfilled,
      (state: CatalogState, action: PayloadAction<ItemProps>) => {
        state.currentItem = action.payload;
        state.itemNotFound = false;
      },
    );
    builder.addCase(
      getItem.pending,
      (state: CatalogState) => {
        state.currentItem = null;
        state.itemNotFound = false;
      },
    );
    builder.addCase(
      getItem.rejected,
      (state: CatalogState) => {
        state.currentItem = null;
        state.itemNotFound = true;
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
        state.categoriesLoaded = true;
      },
    );
    builder.addCase(
      getCategories.pending,
      (state: CatalogState) => {
        state.categories = [];
        state.categoriesLoaded = false;
      },
    );
    builder.addCase(
      getCategories.rejected,
      (state: CatalogState) => {
        state.categoriesLoaded = true;
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
    builder.addCase(
      getBanners.fulfilled,
      (state: CatalogState, action: PayloadAction<Array<BannerProps>>) => {
        state.banners = action.payload;
        state.bannersLoaded = true;
      },
    );
    builder.addCase(
      getBanners.pending,
      (state: CatalogState) => {
        state.banners = [];
        state.bannersLoaded = false;
      },
    );
    builder.addCase(
      getBanners.rejected,
      (state: CatalogState) => {
        state.bannersLoaded = true;
      },
    );
    builder.addCase(
      createBanner.fulfilled,
      (state: CatalogState, action: PayloadAction<BannerProps>) => {
        state.banners.push(action.payload);
      },
    );
    builder.addCase(
      updateBanner.fulfilled,
      (state: CatalogState, action: PayloadAction<BannerProps>) => {
        const updatedBanner = action.payload;
        const index = state.banners.findIndex(b => b.id === updatedBanner.id);
        if (index !== -1) {
          state.banners[index] = updatedBanner;
        }
      },
    );
    builder.addCase(
      deleteBanner.fulfilled,
      (state: CatalogState, action: PayloadAction<number>) => {
        state.banners = state.banners.filter(b => b.id !== action.payload);
      },
    );
  },
});

export const { clearItems } = catalogSlice.actions;
export default catalogSlice.reducer;
