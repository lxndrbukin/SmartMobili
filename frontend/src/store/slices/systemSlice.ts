import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Language, SystemState } from "./types";
import i18n from "../../i18n";

const initialState: SystemState = {
  currentLang: (localStorage.getItem("language") as Language) || "en",
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setLanguage: (state: SystemState, action: PayloadAction<Language>) => {
      state.currentLang = action.payload;
      i18n.changeLanguage(action.payload);
      localStorage.setItem("language", action.payload);
    },
  },
});

export const { setLanguage } = systemSlice.actions;
export default systemSlice.reducer;
