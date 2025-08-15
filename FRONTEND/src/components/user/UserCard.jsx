import React from 'react';
import { useSelector } from 'react-redux';

const UserCard = ({ user, onUserClick }) => {
  const { selectedChat } = useSelector(state => state.chat);
  const { onlineUsers } = useSelector(state => state.socket);
  const isSelected = Array.isArray(selectedChat?.participants)
    ? selectedChat.participants.some(u => u._id === user._id)
    : false;

  const isOnline = onlineUsers.includes(user._id);
  return (
    <div
      className={`flex gap-2 items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 transition ${isSelected ? 'bg-gray-700' : ''}`}
      onClick={onUserClick}
    >
      <div className="relative w-10 h-10">
        <img
          src={user.avatar || '/default_user.png'}
          alt={user.fullName}
          className="w-full h-full rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#324245] bg-green-400"></span>
        )}
      </div>

      <div className="flex flex-col text-white">
        <h1 className="line-clamp-1 font-medium text-sm">{user.fullName}</h1>
        <p className="text-xs text-gray-400">{user.username}</p>
      </div>
    </div>
  );
};
export default UserCard;