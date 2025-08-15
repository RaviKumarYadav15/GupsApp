import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import {server} from './socket/socket.js'
dotenv.config();
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });