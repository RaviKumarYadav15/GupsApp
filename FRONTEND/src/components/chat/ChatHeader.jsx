import React from 'react';
import { useSelector } from 'react-redux';

const ChatHeader = () => {
  const { selectedChat } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  if (!selectedChat || !user) return null;

  let displayName, displayAvatar, subText;

  if (selectedChat.isGroup) {
    displayName = selectedChat.name || "Unnamed Group";
    displayAvatar = selectedChat.avatar || "/default_group.png";
    subText = `${selectedChat.participants.length} members`;
  } else {
    const receiver = selectedChat.participants.find(p => p._id !== user._id);
    if (!receiver) return null;

    displayName = receiver.fullName;
    displayAvatar = receiver.avatar || "/default_user.png";
    subText = `@${receiver.username}`;
  }

  return (
    <div className="p-3 border-b border-gray-700 bg-[#1f2b2e] flex items-center gap-3">
      <img
        src={displayAvatar}
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div>
        <p className="text-white font-semibold">{displayName}</p>
        <p className="text-gray-400 text-sm">{subText}</p>
      </div>
    </div>
  );
};
export default ChatHeader;