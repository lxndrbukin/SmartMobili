import { configureStore } from "@reduxjs/toolkit";
import language from "./slices/languageSlice";

export const store = configureStore({
  reducer: { language },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from "./slices/types";
export * from "./slices/languageSlice";
