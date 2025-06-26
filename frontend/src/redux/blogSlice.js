import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    blogs: []
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setLatestBlogs: (state, action) => {
            state.blogs = action.payload;
        },
        getBlogs: (state) => {
            return state.blogs;
        },
        // New reducer to handle the updating of a single blog
        updateBlog: (state, action) => {
            const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
            if (index !== -1) {
                state.blogs[index] = action.payload; // Update the blog at the found index
            }
        },
    }
});

export const { setLatestBlogs, getBlogs, updateBlog } = blogSlice.actions;

export default blogSlice.reducer;
