import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@shared/types/api';

interface UserSliceState {
  user: User | null;
  activeRole: string | null; 
}

const initialState: UserSliceState = {
  user: null,
  activeRole: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.activeRole = action.payload.roles[0] ?? null;
    },
    setActiveRole: (state, action: PayloadAction<string>) => {
      if (state.user && state.user.roles.includes(action.payload)) {
        state.activeRole = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.activeRole = null;
    },
  },
});

export const { setActiveRole, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
