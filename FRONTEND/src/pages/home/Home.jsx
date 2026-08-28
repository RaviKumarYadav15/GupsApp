import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/sidebar/Sidebar';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import { initializeSocket, setOnlineUsers } from '../../features/socket/socketSlice.js';
import { addNewMessage } from '../../features/message/messageSlice.js';

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
      if (!selectedChat || newMessage.chat._id !== selectedChat._id) return;
      dispatch(addNewMessage(newMessage));
    })
    return () => {
      socket.off("onlineUsers");
      socket.off("newMessage");
    }
  },[socket, selectedChat, dispatch])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};
export default Home;