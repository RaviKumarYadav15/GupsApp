import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../features/message/messageThunks';

import { LuSend } from "react-icons/lu";
import { AiOutlinePaperClip } from 'react-icons/ai';

const MessageInput = () => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const typingTimeoutRef = useRef(null);

  const dispatch = useDispatch();
  const { selectedChat } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const { socket } = useSelector(state => state.socket);

  const handleSend = () => {
    if (!content.trim() && !file) return;

    const formData = new FormData();
    formData.append('content', content.trim());
    if (file) formData.append('file', file);

    dispatch(sendMessageThunk({ chatId: selectedChat._id, formData }));

    setContent('');
    setFile(null);
    setPreviewUrl(null);

    socket.emit("stopTyping", { chatId: selectedChat._id, userId: user._id });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setContent(value);

    if (!socket || !selectedChat) return;

    if (value.trim() !== "") {
      socket.emit("typing", { chatId: selectedChat._id, userId: user._id });
    } else {
      socket.emit("stopTyping", { chatId: selectedChat._id, userId: user._id });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId: selectedChat._id, userId: user._id });
    }, 2000);
  };

  return (
    <div className="p-3 border-t border-gray-700 flex flex-col gap-2 bg-[#1f2b2e]">
      {previewUrl && (
        <div className="relative w-32">
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-md max-h-32 object-contain"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer text-white">
          <AiOutlinePaperClip size={20} />
        </label>

        <textarea
          rows={1}
          placeholder="Type a message"
          className="flex-1 p-2 rounded-md bg-[#2e3d40] text-white resize-none outline-none"
          value={content}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSend}
          className="bg-[#0b3142] cursor-pointer transition duration-300 text-white p-2 rounded-full"
        >
          <LuSend size={20} />
        </button>
      </div>
    </div>
  );
};


export default MessageInput;