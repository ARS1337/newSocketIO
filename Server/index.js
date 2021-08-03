
const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {
  cors: {
    origin: ["http://localhost:3000"],
  },
};
const io = require("socket.io")(httpServer, options);

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id, " connected");
  socket.emit('msg',{socketID:socket.id})
  socket.on("disconnect",()=>{
      console.log("a user disconnected")
  })
  socket.on("data",(data)=>{
    console.log(data)
  })
});

httpServer.listen(3001, () => {
  console.log("server started");
});
