import { Server } from "socket.io";
import http from 'http'
import { app } from "../app.js";
const server = http.createServer(app);
const io = new Server (server,{
    cors:{
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
})

const userSocketMap = {}

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    if(!userId) return ;

    
    userSocketMap[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(userSocketMap))
    
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${userId} left chat ${chatId}`);
    });
    
    socket.on("typing", ({chatId, userId})=>{
        socket.to(chatId).emit("typing", {chatId,userId});
    })
    
    socket.on("stopTyping", ({chatId, userId})=>{
        socket.to(chatId).emit("stopTyping", {chatId,userId});
    })

    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap))
    })
})
const getSocketId = (userId) => {
    return userSocketMap[userId];
}   

export { io, server, getSocketId }
