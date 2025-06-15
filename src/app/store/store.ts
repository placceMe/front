import { configureStore } from "@reduxjs/toolkit";

import languageReducer from "./reducres/language.reducer";

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
