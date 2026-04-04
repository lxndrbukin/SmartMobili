import { configureStore } from "@reduxjs/toolkit";
import system from "./slices/systemSlice";
import auth from "./slices/authSlice";
import catalog from "./slices/catalogSlice";

export const store = configureStore({
  reducer: {
    system,
    auth,
    catalog,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from "./slices/types";
export * from "./slices/systemSlice";
export * from "./slices/authSlice";
export * from "./slices/catalogSlice";
export * from "./thunks/items";
export * from "./thunks/categories";
export * from "./thunks/inquiries";
