import { createSlice } from '@reduxjs/toolkit';

const initialUserState = JSON.parse(localStorage.getItem('user')) || null;

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: initialUserState,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
      console.log('User set in localStorage:', localStorage.getItem('user'));
    },
    clearUser: (state) => {
      console.log('Before clear:', localStorage.getItem('user'));
      state.user = null;
      localStorage.removeItem('user');
      console.log('After clear:', localStorage.getItem('user')); // Should log `null` or `undefined`
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
