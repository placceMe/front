/*import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '@shared/types/api';
import axios from 'axios';

export const fetchProduct = createAsyncThunk<Product, string>(
  'product/fetchProduct',
  async (id) => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  }
);

interface ProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      });
  },
});

export default productSlice.reducer;
*/

// entities/product/model/productSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../../shared/types/api';
import { fetchProduct } from './fetchProduct';

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
  name: 'product',
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
