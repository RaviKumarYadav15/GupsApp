import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMessages, sendMessage } from './messageApi';

export const fetchMessagesThunk = createAsyncThunk(
  'message/fetchMessages',
  async (chatId, thunkAPI) => {
    try {
      const response = await fetchMessages(chatId);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to fetch messages'
      );
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
  'message/sendMessage',
  async ({ chatId, formData }, thunkAPI) => {
    try {
      const response = await sendMessage(chatId, formData);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to send message'
      );
    }
  }
);