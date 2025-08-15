import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice.js";
import chatReducer from "../features/chat/chatSlice.js";
import messageReducer from "../features/message/messageSlice.js";
import socketReducer from '../features/socket/socketSlice.js'

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  message: messageReducer,
  socket: socketReducer,
});


export default rootReducer;