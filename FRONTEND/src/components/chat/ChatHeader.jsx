import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectChat } from '../../features/chat/chatSlice';
import { IoArrowBack } from 'react-icons/io5';

const ChatHeader = () => {
  const { selectedChat } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

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
      <button 
        onClick={() => dispatch(selectChat(null))}
        className="md:hidden text-white mr-1 hover:text-gray-300"
      >
        <IoArrowBack size={24} />
      </button>
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