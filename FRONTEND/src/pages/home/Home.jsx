import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/sidebar/Sidebar';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import { initializeSocket, setOnlineUsers } from '../../features/socket/socketSlice.js';
import { addNewMessage, addTypingUser, removeTypingUser } from '../../features/message/messageSlice.js';
import { incrementUnreadCount } from '../../features/chat/chatSlice.js';

const Home = () => {
  const {isAuthenticated} = useSelector(state=>state.auth);
  const { user } = useSelector(state => state.auth);
  const { socket } = useSelector(state => state.socket);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!isAuthenticated) return ;
    dispatch(initializeSocket(user?._id));
  },[isAuthenticated,dispatch,user?._id])

  const { selectedChat } = useSelector(state => state.chat);

  useEffect(()=>{
    if (!socket) return;
    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on("newMessage", (newMessage)=>{
      if (!selectedChat || newMessage.chat._id !== selectedChat._id) {
        dispatch(incrementUnreadCount(newMessage.chat._id));
        return;
      }
      dispatch(addNewMessage(newMessage));
    });

    const handleTyping = ({chatId, userId})=>{
      dispatch(addTypingUser({chatId,userId}))
    }

    const handleStopTyping = ({chatId,userId})=>{
      dispatch(removeTypingUser({chatId,userId}));
    }

    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off("onlineUsers");
      socket.off("newMessage");
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    }
  },[socket, selectedChat, dispatch])

  return (
    <div className="flex h-screen w-full bg-[#1a2528] overflow-hidden">
      <div className={`w-full md:w-80 md:flex-shrink-0 h-full ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <Sidebar />
      </div>
      <div className={`flex-1 h-full ${selectedChat ? 'flex' : 'hidden md:flex'} flex-col`}>
        <ChatWindow />
      </div>
    </div>
  );
};
export default Home;