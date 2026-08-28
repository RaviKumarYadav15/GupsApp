import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../../features/chat/chatSlice';

const ChatCard = ({ chat, currentUserId }) => {
  const dispatch = useDispatch();
  const { selectedChat, unreadCounts } = useSelector(state => state.chat);
  const { onlineUsers } = useSelector(state => state.socket);
  const { typingUsers } = useSelector(state => state.message);

  const isSelected = selectedChat?._id == chat._id;
  const unreadCount = unreadCounts?.[chat._id] || 0;
  
  const currentTypingUsers = typingUsers[chat._id] || [];
  // Exclude current user from typing just in case
  const isSomeoneTyping = currentTypingUsers.some(id => id !== currentUserId);


  let displayName, displayAvatar, isOnline, subText;

  if (chat.isGroup) {
    displayName = chat.name || "Unknown Group";
    displayAvatar = "/default_group.png";
    subText = `${chat.participants.length} members`
    isOnline = false;
  }
  else {
    const otherUser = chat.participants?.find(p => p._id !== currentUserId);
    if (!otherUser) return null;

    displayName = otherUser.fullName;
    displayAvatar = otherUser.avatar || "/default_user.png";
    subText = otherUser.username;
    isOnline = onlineUsers.includes(otherUser._id);
  }

  const handleSelect = () => {
      dispatch(selectChat(chat));
  };
  return (
    <div
      onClick={handleSelect}
      className={`cursor-pointer rounded-md px-2 py-1 transition hover:bg-gray-700 ${isSelected ? 'bg-gray-700' : ''}`}
    >
      <div className='flex items-center gap-2 flex-1'>
        <div className="relative w-10 h-10">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-full h-full rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#1f2b2e] bg-green-400"></span>
          )}
        </div>
        <div className='flex flex-col flex-1 overflow-hidden'>
          <span className='text-sm font-medium truncate'>{displayName}</span>
          {isSomeoneTyping ? (
            <span className='text-xs text-green-400 font-semibold italic truncate'>typing...</span>
          ) : (
            <span className='text-xs text-gray-400 truncate'>{subText}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatCard;