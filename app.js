const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
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
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size);

  //Remove on disconnect
  socket.on("disconnect", () => {
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  // Error handler
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
}
