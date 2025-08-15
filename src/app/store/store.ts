import { configureStore } from "@reduxjs/toolkit";
//import cartReducer from '@features/cart/model/cartSlice';
import cartReducer from '../../features/cart/model/cartSlice';
import languageReducer from "./reducres/language.reducer";
//import productReducer from '../../entities/product/model/productSlice';
import userReducer from '../../entities/user/model/userSlice';
import categoriesReducer from '../../entities/category/model/categoriesSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    cart: cartReducer,
//    product: productReducer,
    user: userReducer,
    categories:categoriesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

