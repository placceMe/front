import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@shared/types/api';

interface UserSliceState {
  user: User | null;
  activeRole: string | null; 
    isLoaded: boolean;
}

const initialState: UserSliceState = {
  user: null,
  activeRole: null,
  isLoaded: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.activeRole = action.payload.roles[0] ?? null;
      state.isLoaded = true;
    },
    setActiveRole: (state, action: PayloadAction<string>) => {
      if (state.user && state.user.roles.includes(action.payload)) {
        state.activeRole = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.activeRole = null;
      state.isLoaded = true;
    },
  },
});

export const { setActiveRole, setUser, logout } = userSlice.actions;
export default userSlice.reducer;
