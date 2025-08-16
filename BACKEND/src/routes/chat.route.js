import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { accessChat, getAllMyChats } from "../controllers/chat.controller.js";
const router = express.Router();

router.get('/',verifyJWT,getAllMyChats);
router.get('/access/:receiverId',verifyJWT,accessChat);
export default router