import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser,getProfile,logoutUser,getOtherUsers } from './authApi';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      localStorage.setItem("hasSession", "true");
      localStorage.setItem("user", JSON.stringify(res.data.data));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);
export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await registerUser(formData);
      localStorage.setItem("hasSession", "true");
      localStorage.setItem("user", JSON.stringify(res.data.data));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutUser();
      localStorage.removeItem("hasSession");
      localStorage.removeItem("user");
      return res.data.message;
    } catch (err) {
      localStorage.removeItem("hasSession");
      localStorage.removeItem("user");
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

export const getProfileThunk = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfile();
      localStorage.setItem("hasSession", "true");
      localStorage.setItem("user", JSON.stringify(res.data.data));
      return res.data.data;
    } catch (err) {
      localStorage.removeItem("hasSession");
      localStorage.removeItem("user");
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  'auth/getOtherUsers',
  async(_,{rejectWithValue})=>{
    try {
      const res = await getOtherUsers();
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fecth Other users')
    }
  }
)