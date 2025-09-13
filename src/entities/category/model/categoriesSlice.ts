
import { createSlice, type PayloadAction,  } from '@reduxjs/toolkit';
import type { Category } from '@shared/types/api';

interface CategoriesState {
  all: Category[];
  active: Category[];
}

const initialState: CategoriesState = {
  all: [],
  active: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.all = action.payload;
      state.active = action.payload;
    },
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
