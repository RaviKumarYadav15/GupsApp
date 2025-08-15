import express from "express";
import {register,login,logout,refreshAccessToken, getProfile, getOtherUsers} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', upload.single("avatar"), register);
router.post('/login', login);
router.post('/logout',verifyJWT,logout);
router.get('/refresh-token',verifyJWT,refreshAccessToken);
router.get('/profile',verifyJWT,getProfile)
router.get('/otherUsers',verifyJWT,getOtherUsers)

export default router