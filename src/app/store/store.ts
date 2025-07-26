import { configureStore } from "@reduxjs/toolkit";
//import cartReducer from '@features/cart/model/cartSlice';
import cartReducer from '../../features/cart/model/cartSlice';
import languageReducer from "./reducres/language.reducer";
import productReducer from '../../entities/product/model/productSlice';
import userReducer from '../../entities/user/model/userSlice';


export const store = configureStore({
  reducer: {
    language: languageReducer,
    cart: cartReducer,
    product: productReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

