
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CurrencyState {
  current: 'UAH' | 'USD' | 'EUR';
  rates: Record<string, number>; // { USD: 40.2, EUR: 43.1 }
}

const initialState: CurrencyState = {
  current: 'UAH',
  rates: { UAH: 1, USD: 0, EUR: 0 },
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<'UAH' | 'USD' | 'EUR'>) {
      state.current = action.payload;
    },
    setRates(state, action: PayloadAction<Record<string, number>>) {
      state.rates = { ...state.rates, ...action.payload };
    },
  },
});

export const { setCurrency, setRates } = currencySlice.actions;
export default currencySlice.reducer;
