import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client'

const initialState={
  socket:null,
  onlineUsers:[],
}
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      if (state.socket) {
        state.socket.close();
      }
      const socket = io(import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL || "http://localhost:8000", {
        query: {
          userId: action.payload,
        }
      });
      state.socket = socket;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.close();
        state.socket = null;
      }
    },
  },
});

export const { initializeSocket, setOnlineUsers, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;