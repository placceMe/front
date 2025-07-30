/*import { createSlice } from "@reduxjs/toolkit";
import { fetchProduct } from "./fetchProduct";
import type { Product } from "@shared/types/api";

interface ProductState {
  product: Product | null;
  loading: boolean;
  error?: string;
}

const initialState: ProductState = {
  product: null,
  loading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.product = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
*/