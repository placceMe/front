/*import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@shared/types/cart';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(i => i.product.id === action.payload.productId);
      if (item) item.quantity = action.payload.quantity;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.product.id === action.payload.product.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
  }
});

export const { setCart, updateQuantity, removeItem, addToCart } = cartSlice.actions;
export default cartSlice.reducer;
*/
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../shared/types/api';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Для полной замены корзины (опционально)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    // Обновление количества
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(i => i.product.id === action.payload.productId);
      if (item) item.quantity = action.payload.quantity;
    },
    // Удаление товара из корзины
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    // Добавление товара в корзину
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find(i => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    // Очистить корзину
    
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, updateQuantity, removeItem, addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
