import { Server } from "socket.io";
import Message from "./models/message.model.js";

const userSocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        callback(null, true);
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling", "websocket"],
  });

  io.on("connection", (socket) => {
    console.log("⚡ A user connected:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Handle sending message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      if (!text || text.trim() === "") return;
      try {
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          text: text.trim(),
        });

        // Broadcast to receiver if online
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", message);
        }

        // Send back confirmation to sender
        socket.emit("messageSent", message);
      } catch (err) {
        console.error("Error sending message via socket:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return io;
};
