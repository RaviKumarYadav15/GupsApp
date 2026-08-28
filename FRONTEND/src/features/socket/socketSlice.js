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
      const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "";
      const fallbackUrl = baseUrl ? baseUrl.replace("/api/v1", "") : "http://localhost:8000";
      const socket = io(import.meta.env.VITE_BACKEND_URL || fallbackUrl, {
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