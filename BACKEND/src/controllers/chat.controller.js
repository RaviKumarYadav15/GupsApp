import { Message } from "../models/Message.model.js";
import { Chat } from "../models/Chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllMyChats = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const chats = await Chat.find({ participants: currentUserId })
    .populate("participants", "-password")
    .sort({ updatedAt: -1 });

  res.status(200).json(new ApiResponse(200, chats, "Fetched all chats"));
});

/**
 * Access or Create a 1-on-1 chat with another user
 */
const accessChat = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const currentUserId = req.user._id;

  if (!receiverId) {
    throw new ApiError(400, "receiverId param not sent");
  }

  let chat = await Chat.findOne({
    isGroup: false,
    participants: { $all: [currentUserId, receiverId], $size: 2 },
  })
    .populate("participants", "-password");

  if (chat) {
    return res
      .status(200)
      .json(new ApiResponse(200, chat, "Chat found or resumed"));
  }

  // If chat doesn't exist, create new
  const newChat = await Chat.create({
    name: "one-to-one",
    isGroup: false,
    participants: [currentUserId, receiverId],
  });

  // Return full chat with populated participants
  const fullChat = await Chat.findById(newChat._id).populate("participants", "-password");

  res.status(201).json(new ApiResponse(201, fullChat, "New chat created"));
});
 
/**
 * Get full details of a single chat by ID
 */
const getSingleChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId)
    .populate("participants", "-password");

  if (!chat) throw new ApiError(404, "Chat not found");

  const messages = await Message.find({ chat: chatId })
  .sort({ createdAt: 1 })
  .populate("sender", "fullName username email avatar");


  res.status(200).json(new ApiResponse(200, {chat,messages}));
});

/**
 * Leave a group chat (only applies to groups)
 */
const leaveGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const currentUserId = req.user._id;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { participants: currentUserId } },
    { new: true }
  ).populate("participants", "-password");

  if (!updatedChat) throw new ApiError(404, "Chat not found");

  res.status(200).json(new ApiResponse(200, updatedChat, "Left the group"));
});

/**
 * Delete a chat and all its messages
 */
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const deletedChat = await Chat.findByIdAndDelete(chatId);
  if (!deletedChat) throw new ApiError(404, "Chat not found");

  await Message.deleteMany({ chat: chatId });

  res.status(200).json(new ApiResponse(200, {}, "Chat and messages deleted"));
});

/**
 * Get all group chats where current user is a member
 */
const getMyGroupsOnly = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const groups = await Chat.find({
    isGroup: true,
    participants: currentUserId,
  }).populate("participants", "-password");

  res.status(200).json(new ApiResponse(200, groups));
});

export {
  getAllMyChats,
  accessChat,
  getSingleChatById,
  leaveGroupChat,
  deleteChat,
  getMyGroupsOnly,

};
