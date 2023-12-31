import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () =>{
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () =>{
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchPostsByTags = createAsyncThunk('/posts/fetchPostsByTags', async (tag) => {
    const { data } = await axios.get(`/tags/${tag}`);
    return data;
})

export const fetchComments = createAsyncThunk('posts/fetchComments', async (id) =>{
    const { data } = await axios.get(`/posts/${id}/comments`)
    return data;
})

export const fetchRemove = createAsyncThunk('posts/fetchRemove', (id) => axios.delete(`/posts/${id}`));

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading'
    },
    comments: {
        items: [],
        status: 'loading'
    },
    tagPosts: {
        items: [],
        status: 'loading'
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {
        // Get All Posts
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        // Get Tags
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
        // Get Posts with certain tags
        [fetchPostsByTags.pending]: (state) => {
            state.tagPosts.items = [];
            state.tagPosts.status = 'loading';
        },
        [fetchPostsByTags.fulfilled]: (state, action) => {
            state.tagPosts.items = action.payload;
            state.tagPosts.status = 'loaded';
        },
        [fetchPostsByTags.rejected]: (state) => {
            state.tagPosts.items = [];
            state.tagPosts.status = 'error';
        },
        //Get Comments
        [fetchComments.pending]: (state) => {
            state.comments.items = [];
            state.comments.status = 'loading';
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload;
            state.comments.status = 'loaded';
        },
        [fetchComments.rejected]: (state) => {
            state.comments.items = [];
            state.comments.status = 'error';
        },
        // Post Remove
        [fetchRemove.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
            state.posts.status = 'loading';
        },
        [fetchRemove.rejected]: (state) => {
            state.posts.status = 'error';
        }
    }
})

export const postsReducer = postsSlice.reducer;