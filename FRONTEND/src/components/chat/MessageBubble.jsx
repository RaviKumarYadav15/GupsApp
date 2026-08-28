import React from 'react';
import { useSelector } from 'react-redux';

const MessageBubble = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedChat } = useSelector((state) => state.chat);

  if (!message?.content && !message?.file) return null;
  const senderId = message?.sender?._id;
  const isOwnMessage = senderId === user?._id;
  const isGroupChat = selectedChat?.isGroup;

  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    : 'Time unknown';

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="flex flex-col max-w-[70%]">

        {isGroupChat && !isOwnMessage && (
          <span className="text-xs text-gray-700 font-semibold mb-1">
            {message?.sender?.fullname}
          </span>
        )}

        <div
          className={`px-4 py-2 rounded-xl shadow text-white ${isOwnMessage
              ? 'bg-[#7785ac] rounded-br-none'
              : 'bg-[#6b7f82] rounded-bl-none'
            }`}
        >
          {message.content && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {message.file && (
            <div className="mt-2">
              <img
                src={message.file}
                alt="attachment"
                onClick={() => setIsModalOpen(true)}
                className="max-w-full max-h-60 rounded-md object-contain cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          )}
          <div className="text-[10px] text-black text-right opacity-80 mt-1">
            {formattedTime} 
          </div>
        </div>
      </div>

      {isModalOpen && message.file && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full flex justify-center">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <img
              src={message.file}
              alt="fullscreen attachment"
              className="max-w-full max-h-[85vh] object-contain rounded-md"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default MessageBubble;