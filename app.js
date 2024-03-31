const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

//Port listening
const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

//To make it static
app.use(express.static(path.join(__dirname, "public")));

//Socket IO
const io = require("socket.io")(server);

let socketsConnected = new Set();

//On new connected
io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id)
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size)

  //Remove on disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size)
  })

  socket.on("message", (data) => {
    console.log(data)
    socket.broadcast.emit("chat-message", data)
  })

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data)
  })

  // Error handler
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
}