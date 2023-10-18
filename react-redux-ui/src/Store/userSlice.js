import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_LOGIN_API_URL;
const loginUrl = `${apiUrl}/login`;
const registerUrl = `${apiUrl}/register`;

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data) => {
    const response = await axios.post(loginUrl, data);
    localStorage.setItem('accessToken', response.data.access_token);
    localStorage.setItem('user', response.data.user);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data) => {
    const response = await axios.post(registerUrl, data);
    localStorage.setItem('accessToken', response.data.access_token);
    localStorage.setItem('user', response.data.user);
    return response.data;
  }
);

const initialState = {
  loading: false,
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        if (action.error.message === 'Request failed with status code 401') {
          state.error = 'Login failed. Please check your credentials.';
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(registerUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        if (action.error.message === 'Request failed with status code 409') {
          state.error = 'That email already exists.';
        } else {
          state.error = action.error.message;
        }
      });
    ;
  }
});

export default userSlice.reducer;

