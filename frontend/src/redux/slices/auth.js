import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (params) => {
    const { data } = await axios.post('/auth/login', params);
    return data;
});

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.get('/auth/me');
    return data;
});


export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
});

const initialState = {
    data: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'loaded'
        }
    },
    extraReducers: {
        // User Login
        [fetchUserData.pending]: (state) => {
            state.status = 'loading';
        },
        [fetchUserData.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchUserData.rejected]: (state) => {
            state.status = 'error';
            state.data = null;
        },
        // User Authentication        
        [fetchAuth.pending]: (state) => {
            state.status = 'loading';
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchAuth.rejected]: (state) => {
            state.status = 'error';
            state.data = null;
        },
        // User Registration
        [fetchRegister.pending]: (state) => {
            state.status = 'loading';
            state.status = null;
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchRegister.rejected]: (state) => {
            state.status = 'error';
            state.data = null;
        },
    }
})

export const selectorIsAuth = state => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;