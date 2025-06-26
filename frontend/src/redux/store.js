import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import blogReducer from './blogSlice';


const store = configureStore({
  reducer: {
    user: userReducer, // Add the user reducer
    blog: blogReducer, // Add the blog reducer
  },
});

export default store;
