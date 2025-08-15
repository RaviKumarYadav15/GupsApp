import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMychats, accessChats } from './chatApi.js';

export const fetchMyChatsThunk = createAsyncThunk(
  'chat/fetchMyChats',
  async (_, thunkAPI) => {
    try {
      const res = await fetchMychats();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch chats');
    }
  }
);
export const accessChatThunk = createAsyncThunk(
  'chat/accessChat',
  async (receiverId, thunkAPI) => {
    try {
      const res = await accessChats(receiverId);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to access chat');
    }
  }
);