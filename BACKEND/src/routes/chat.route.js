import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { accessChat, getAllMyChats, getSingleChatById } from "../controllers/chat.controller.js";
const router = express.Router();

router.get('/access/:receiverId',verifyJWT,accessChat);
router.get('/',verifyJWT,getAllMyChats);
router.get("/single/:chatId", verifyJWT, getSingleChatById);

export default router