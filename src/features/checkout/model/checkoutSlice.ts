// features/checkout/model/checkoutSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CheckoutFormData {
  fullName: string;
  city: string;
  address: string;
  deliveryMethod: 'np-branch' | 'np-courier' | 'self-pickup';
  paymentMethod: 'cod' | 'bank';
  agree: boolean;
}



interface CheckoutState {
  form: CheckoutFormData;
}

const initialState: CheckoutState = {
  form: {
    fullName: '',
    city: '',
    address: '',
    deliveryMethod: 'np-branch',
    paymentMethod: 'cod',
      agree: false
  },
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<Partial<CheckoutFormData>>) {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm(state) {
      state.form = initialState.form;
    },
  },
});

export const { updateForm, resetForm } = checkoutSlice.actions;
export default checkoutSlice.reducer;

