import React, { useEffect, useState } from 'react';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LuUserRoundSearch } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import UserCard from '../user/UserCard';
import ChatCard from '../chat/ChatCard';

import { accessChatThunk, fetchMyChatsThunk } from '../../features/chat/chatThunks';
import { getOtherUsersThunk, logoutThunk } from '../../features/auth/authThunks.js';

import { clearMessages } from '../../features/message/messageSlice.js';
import { clearChatState, selectChat } from '../../features/chat/chatSlice.js';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, otherUsers, isAuthenticated } = useSelector(state => state.auth);
  const { chats } = useSelector(state => state.chat);

  const [search, setSearch] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [showAllOtherUser, setShowAllOtherUsers] = useState(false);

  const handleAccessChat = async (receiverId) => {
    try {
      dispatch(clearMessages());
      const chat = await dispatch(accessChatThunk(receiverId)).unwrap();
      dispatch(selectChat(chat));
    } catch (error) {
      toast.error("Error accessing chat", error);
    }
  };

  /*
    //note:🔥 .unwrap() solves two problems:
    // ✅ Gives you direct access to payload (i.e., your returned data)
    // ❌ Automatically throws an error if the thunk was rejected — so you can try/catch like normal async/await
  
    
    🔍 When Do You Need .unwrap()?
    Only if:
    You want to use the result immediately in the component
    You want to catch errors using try/catch
    You want to control additional side effects manually 
  */

  const handleLogout = async () => {
    try {
      dispatch(clearMessages());
      dispatch(clearChatState());
      await dispatch(logoutThunk()).unwrap();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed!', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !otherUsers?.length && !chats?.length) {
      dispatch(getOtherUsersThunk());
      dispatch(fetchMyChatsThunk());
    }
  }, [isAuthenticated, otherUsers, showAllOtherUser, dispatch, chats]);

  const filteredUsers = Array.isArray(otherUsers)
    ? otherUsers.filter(
      u =>
        u._id !== user?._id &&
        u.fullName.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  const filteredChats = chats.filter(chat => {
    if (!user || !Array.isArray(chat.participants)) return false;

    if (chat.isGroup) {
      const groupNameMatch = chat.name?.toLowerCase().includes(chatSearch.toLowerCase());

      const participantsMatch = chat.participants.some(
        p => p._id !== user._id && p.fullName.toLowerCase().includes(chatSearch.toLowerCase())
      );
      return groupNameMatch || participantsMatch;
    }
    const otherUser = chat.participants.find(p => p._id !== user._id);
    return otherUser?.fullName.toLowerCase().includes(chatSearch.toLowerCase());
  });

  return (
    <div className='bg-[#1f2b2e] text-white w-full max-w-80 h-screen p-4 flex flex-col gap-4'>

      {/* Header */}
      <div className='flex items-center gap-4'>
        <IoChatboxEllipsesOutline className='text-4xl text-[#574ae2]' />
        <h1 className='text-xl font-bold'>GupsApp</h1>
      </div>

      {/* Chat Search and New Chat Button */}
      <div className='flex items-center justify-between gap-2'>
        <div className='relative w-full'>
          <LuUserRoundSearch className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg' />
          <input
            type='text'
            placeholder='Search Chats'
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
            className='w-full pl-1 pr-10 py-2 rounded-md bg-[#344d50] text-sm placeholder-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400'
          />
        </div>
        <button
          onClick={() => setShowAllOtherUsers(true)}
          className='ml-2 px-3 py-2 w-40 text-sm bg-[#574ae2] text-white rounded-md hover:bg-[#370568d6] cursor-pointer transition duration-300'
        >
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto space-y-3 pl-2 pt-2'>
        {user?._id && filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <ChatCard key={chat._id} chat={chat} currentUserId={user._id} />
          ))
        ) : (
          <p className="text-sm text-gray-400 px-2">No chats found.</p>
        )}
      </div>

      {/* New Chat Modal */}
      {showAllOtherUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-[#2a3b3f] w-96 max-h-[80vh] overflow-y-auto rounded-lg p-4">
            <div className='flex justify-between items-center mb-3'>
              <h2 className="text-lg font-semibold text-white">Start New Chat</h2>
              <button
                onClick={() => setShowAllOtherUsers(false)}
                className="text-white w-10 hover:text-green-500 text-xl cursor-pointer font-bold"
              >
                X
              </button>
            </div>

            <div className='relative w-full mb-4'>
              <LuUserRoundSearch className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg' />
              <input
                type='text'
                placeholder='Search Users'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full pl-1 pr-10 py-2 rounded-md bg-[#344d50] text-sm placeholder-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400'
              />
            </div>
            <div className='h-100'>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div key={user._id} className='mb-2' onClick={() => setShowAllOtherUsers(false)}>
                    <UserCard user={user} onUserClick={() => handleAccessChat(user._id)} />
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No users available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer: Current User Info */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <img
              src={user?.avatar}
              alt={user?.fullName}
              className="w-full h-full rounded-full object-cover"
            />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1f2b2e] bg-violet-400"></span>
          </div>
          <div className="text-sm leading-4">
            <p className="font-medium">{user?.fullName}</p>
            <p className="text-xs text-gray-400">{user?.username}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className='px-3 py-1 text-sm rounded-md bg-[#1d6d80] hover:bg-[#344d50] cursor-pointer'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;