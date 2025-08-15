import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/:chatId", verifyJWT, upload.single("file"), sendMessage);
router.get("/:chatId", verifyJWT, getMessages);
export default router