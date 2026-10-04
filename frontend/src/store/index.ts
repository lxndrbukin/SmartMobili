import { configureStore } from "@reduxjs/toolkit";
import system from "./slices/systemSlice";
import auth from "./slices/authSlice";
import catalog from "./slices/catalogSlice";
import services from "./slices/servicesSlice";
import latestWorks from "./slices/latestWorksSlice";
import admin from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    system,
    admin,
    auth,
    catalog,
    services,
    latestWorks,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from "./slices/types";
export * from "./slices/systemSlice";
export * from "./slices/authSlice";
export * from "./slices/catalogSlice";
export * from "./slices/servicesSlice";
export * from "./slices/latestWorksSlice";
export * from "./thunks/items";
export * from "./thunks/categories";
export * from "./thunks/services";
export * from "./thunks/serviceCategories";
export * from "./thunks/inquiries";
export * from "./thunks/auth";
export * from "./thunks/banners";
export * from "./thunks/latestWorks";