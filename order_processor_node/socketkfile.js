export const socketConnection = io => {
  io.on("connection", socket => {
    console.log("Started socket connection!");

    socket.on("message", receivedMessage => {
      console.log("Socket message received", receivedMessage);
    });

    socket.on("subscribe", async room => {
      try {
        console.log(`In room`, socket.rooms);
        await socket.join(room);
        console.log(`[socket] Room Joined Successfully : ${room}`, room);
        await io.to(room).emit("subscribeSuccess", `Subscribed successfully ${socket.id}: room - ${socket.rooms}`);
      } catch (e) {
        console.log(`[socket] Error in Room Joining : ${room} : ${e}`, e);
        socket.emit("error", "couldnt perform requested action");
      }
    });

    socket.on("unsubscribe", async room => {
      try {
        await socket.leave(room);
        console.log(`[socket] Room Left Successfully : ${room}`, room);
      } catch (e) {
        console.log(`[socket] Error in Room Leaving : ${room} : ${e}`, e);
        socket.emit("error", "couldnt perform requested action");
      }
    });

  });
};

