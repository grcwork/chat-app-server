const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push(id);
  }
  io.emit("activeUsers", users);

  socket.on("privateChatMessage", (message) => {
    socket.to(message.receiverId).emit("dm", {sender: socket.id, message: message.messageText});
  });

  socket.on("disconnect", () => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push(id);
    }
    io.emit("activeUsers", users);
  });
});

httpServer.listen(3000, () => {
  console.log("Listening on port 3000");
});
