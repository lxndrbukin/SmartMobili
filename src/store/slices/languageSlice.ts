import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Language, LanguageState } from "./types";
import i18n from "../../i18n";

const initialState: LanguageState = {
  current: (localStorage.getItem("language") as Language) || "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state: LanguageState, action: PayloadAction<Language>) => {
      state.current = action.payload;
      i18n.changeLanguage(action.payload);
      localStorage.setItem("language", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
