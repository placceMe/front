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
  userId: string;
}

const initialState: CartState = {
  items: [],
  userId: "guest",
};

const getCartKey = (userId: string) => `cart_${userId}`;

const syncLocalStorage = (items: CartItem[], userId: string) => {
  const filtered = items
    .filter(item => item.quantity >= 2)
    .map(({ product, quantity }) => ({
      id: product.id,
      quantity
    }));
  localStorage.setItem(getCartKey(userId), JSON.stringify(filtered));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Установка ID пользователя (нужно вызывать после авторизации)
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },

    // Полная замена корзины (например, после загрузки из localStorage)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      syncLocalStorage(state.items, state.userId);
    },

    // Обновление количества
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.product.id === productId);
      if (item) {
  item.quantity = quantity;
}

      syncLocalStorage(state.items, state.userId);
    },

    // Удаление товара
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.product.id !== action.payload);
      syncLocalStorage(state.items, state.userId);
    },

    // Добавление товара
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find(i => i.product.id === product.id);

       if (existing) {
    existing.quantity += quantity;
    if (existing.quantity < 1) {
      state.items = state.items.filter(i => i.product.id !== product.id);
    }
  } else {
    if (quantity >= 1) {
      state.items.push({ product, quantity });
    }
  }

  syncLocalStorage(state.items, state.userId);
},

    // Очистка корзины
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(getCartKey(state.userId));
    },
  },
});

export const {
  setUserId,
  setCart,
  updateQuantity,
  removeItem,
  addToCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
