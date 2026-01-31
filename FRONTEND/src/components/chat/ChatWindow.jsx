import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

import { fetchMessagesThunk} from '../../features/message/messageThunks';

import {addTypingUser, removeTypingUser} from '../../features/message/messageSlice.js'

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector(state => state.chat);
  const { messages,typingUsers} = useSelector(state => state.message);
  const {socket}  = useSelector(state => state.socket);
  const messagesEndRef = useRef();
  const prevChatRef = useRef(null);
  
  const currentTypingUsersName = (typingUsers[selectedChat?._id] || []).map((id)=>{
    const user = selectedChat?.participants?.find(u => u._id === id);
    return user ? user.username: "Anonymous";
  });

  useEffect(() => {
    if (selectedChat?._id) {
      dispatch(fetchMessagesThunk(selectedChat._id));
    }
  }, [dispatch, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages,currentTypingUsersName.length]);

  useEffect(()=>{
    if(!socket || !selectedChat?._id) return;

    // if(prevChatRef.current){
    //   socket.emit("leaveChat",prevChatRef.current);             
    //   //leaving the previous joined chat
    // }
    if(prevChatRef.current && prevChatRef.current !== selectedChat._id){
      socket.emit("leaveChat", prevChatRef.current);
    }


    socket.emit("joinChat", selectedChat._id);
    prevChatRef.current = selectedChat._id
;
    const handleTyping = ({chatId, userId})=>{
      dispatch(addTypingUser({chatId,userId}))
    }

    const handleStopTyping = ({chatId,userId})=>{
      dispatch(removeTypingUser({chatId,userId}));
    }

    socket.on('typing', handleTyping);
    socket.on('stopTyping',handleStopTyping);

    return ()=>{
      if(selectedChat._id){
        socket.emit("leaveChat",selectedChat._id);
      }
      socket.off('typing', handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  },[socket,selectedChat,dispatch]);
  

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#1a2528]">
        {messages.map(msg => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
        {
          currentTypingUsersName.length>0 && (
            <div className='text-sm text-gray-300 italic'>
              {currentTypingUsersName.join(', ')} {currentTypingUsersName.length > 1 ? 'are' : 'is'} typing...
            </div>
          )
        }
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;