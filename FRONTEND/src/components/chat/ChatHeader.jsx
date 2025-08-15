import React from 'react';
import { useSelector } from 'react-redux';

const ChatHeader = () => {
  const { selectedChat } = useSelector(state => state.chat);
  const {user} = useSelector(state => state.auth);

  if (!selectedChat || !user) return null;

  const receiver = selectedChat.participants.find(
    p => p?._id !== user._id
  );

  return (
    <div className="p-3 border-b border-gray-700 bg-[#1f2b2e] flex items-center gap-3">
      <img
        src={receiver?.avatar || "/default_user.png"}
        alt={receiver?.username}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div>
        <p className="text-white font-semibold">{receiver?.fullName}</p>
        <p className="text-gray-400 text-sm">@{receiver?.username}</p>
      </div>
    </div>
  );
};

export default ChatHeader;