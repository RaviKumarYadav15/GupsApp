import { createSlice } from '@reduxjs/toolkit';
import { fetchMyChatsThunk, accessChatThunk } from './chatThunks';

const chatSlice = createSlice({
  name: 'chat',
  
  initialState: {
    chats: [],
    selectedChat: null,
    loading: false,
    error: null
  },

  reducers: {
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    clearChatState: () => ({
      chats: [],
      selectedChat: null,
      loading: false,
      error: null
    })
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyChatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyChatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchMyChatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.chats=[]
      })
      .addCase(accessChatThunk.fulfilled, (state, action) => {
        const exists = state.chats.find(chat => chat._id === action.payload._id);
        if (!exists) state.chats.push(action.payload);
        state.selectedChat = action.payload;
      });
  }
});

export const { selectChat, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;