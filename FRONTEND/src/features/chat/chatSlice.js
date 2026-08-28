import { createSlice } from '@reduxjs/toolkit';
import { fetchMyChatsThunk, accessChatThunk } from './chatThunks';

let savedSelectedChat = null;
try {
  savedSelectedChat = JSON.parse(localStorage.getItem("selectedChat") || "null");
} catch (e) {
  console.error("Failed to parse selectedChat from local storage", e);
}

const chatSlice = createSlice({
  name: 'chat',
  
  initialState: {
    chats: [],
    selectedChat: savedSelectedChat,
    loading: false,
    error: null
  },

  reducers: {
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
      if (action.payload) {
        localStorage.setItem("selectedChat", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("selectedChat");
      }
    },
    clearChatState: () => {
      localStorage.removeItem("selectedChat");
      return {
        chats: [],
        selectedChat: null,
        loading: false,
        error: null
      };
    }
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
        localStorage.setItem("selectedChat", JSON.stringify(action.payload));
      });
  }
});

export const { selectChat, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;