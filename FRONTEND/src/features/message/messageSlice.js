import { createSlice } from '@reduxjs/toolkit';
import { fetchMessagesThunk, sendMessageThunk } from './messageThunks';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    messages: [],
    loading: false,
    typingUsers: {},
    error: null
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addTypingUser: (state,action)=>{
      const {chatId,userId} = action.payload;
      if(!state.typingUsers[chatId]){
        state.typingUsers[chatId] = [];
      }

      if(!state.typingUsers[chatId].includes(userId)){
        state.typingUsers[chatId].push(userId);
      }
    },
    removeTypingUser : (state,action) =>{
      const {chatId, userId} = action.payload;
      if(state.typingUsers[chatId]){
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(
          id => id!==userId
        );
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(sendMessageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        // state.messages.push(action.payload);
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});
export const { 
  clearMessages, 
  addNewMessage ,
  addTypingUser,
  removeTypingUser
} = messageSlice.actions;
export default messageSlice.reducer;