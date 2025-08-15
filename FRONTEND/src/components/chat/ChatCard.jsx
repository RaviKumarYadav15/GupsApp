import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../../features/chat/chatSlice';

const ChatCard = ({ chat, currentUserId }) => {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector(state => state.chat);
  const { onlineUsers } = useSelector(state => state.socket);

  const otherUser = chat.participants.find(p => p._id !== currentUserId);
  const isSelected = selectedChat?._id === chat._id;
  const isOnline = onlineUsers.includes(otherUser._id); 

  if (!otherUser) return null;

  return (
    <div
      onClick={() => dispatch(selectChat(chat))}
      className={`cursor-pointer rounded-md px-2 py-1 transition hover:bg-gray-700 ${isSelected ? 'bg-gray-700' : ''}`}
    >
      <div className='flex items-center gap-2'>
        <div className="relative w-10 h-10">
          <img
            src={otherUser.avatar || '/default_user.png'}
            alt={otherUser.fullName}
            className="w-full h-full rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#1f2b2e] bg-green-400"></span>
          )}
        </div>
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>{otherUser.fullName}</span>
          <span className='text-xs text-gray-400'>{otherUser.username}</span>
        </div>
      </div>
    </div>
  );
};
export default ChatCard;