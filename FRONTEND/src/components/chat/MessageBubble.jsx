import React from 'react';
import { useSelector } from 'react-redux';

const MessageBubble = ({ message }) => {
  const currentUser = useSelector(state => state.auth.user);
  const senderId = message?.sender?._id;
  const isOwnMessage = senderId === currentUser?._id;

  if (!message?.content && !message?.file) return null;

  return (

    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl shadow text-white
        ${isOwnMessage ? 'bg-[#7785ac] rounded-br-none' : 'bg-[#6b7f82] rounded-bl-none'}`}
      >

        {message.content && (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}

        {message.file && (
          <div className="mt-2">
            <img
              src={message.file}
              alt="attachment"
              className="max-w-full max-h-60 rounded-md object-contain"
            />
          </div>
        )}

        <div className="text-[10px] text-black text-right opacity-80 mt-1">
          {message.createdAt
            ? new Date(message.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
            : 'Time unknown'}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;