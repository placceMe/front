import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "@shared/types/api";

interface ProductState {
  product: Product | null;
  loading: boolean;
}

const initialState: ProductState = {
  product: null,
  loading: false,
};
export const fetchProduct = createAsyncThunk(
  "product/fetch",
  async (id: string) => {
    const res = await fetch(`http://localhost:5003/api/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    return await res.json();
  }
);


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
