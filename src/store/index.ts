import { configureStore } from "@reduxjs/toolkit";
import system from "./slices/systemSlice";
import catalog from "./slices/catalogSlice";

export const store = configureStore({
  reducer: {
    system,
    catalog,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from "./slices/types";
export * from "./slices/systemSlice";
export * from "./slices/catalogSlice";
export * from "./thunks/items";
