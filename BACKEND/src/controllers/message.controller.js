import { Message } from "../models/Message.model.js";
import { Chat } from "../models/Chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getSocketId, io } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { chatId } = req.params;
  const sender = req.user._id;

  let fileUrl = "";
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    fileUrl = uploaded?.secure_url;
  }

  const message = await Message.create({
    sender,
    content,
    file: fileUrl || null,
    chat: chatId,
  });

  const fullMessage = await Message.findById(message._id)
    .populate("sender", "fullName username avatar")
    .populate("chat");

  const chat = await Chat.findById(chatId).populate("participants", "_id");

  chat.participants.forEach(participant => {
    const participantId = participant._id.toString();
    const socketId = getSocketId(participantId);
    if (socketId) {
      io.to(socketId).emit("newMessage", fullMessage);
    }
  });
  res.status(201).json(new ApiResponse(201, fullMessage, "Message sent"));
});

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .sort({ createdAt: 1 }) // sorted oldest to newest
    .populate("sender", "fullName username avatar");

  res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});

export {
  sendMessage,
  getMessages,
};