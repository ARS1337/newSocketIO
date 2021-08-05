const express = require("express");
const cors = require("cors");
const { read } = require("fs");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
const httpServer = require("http").createServer(app);
const options = {
  cors: {
    origin: ["http://localhost:3000","http://192.168.1.6:3000"],
  },
};
const io = require("socket.io")(httpServer, options);
const { body, validationResult } = require("express-validator");
const {
  updateUser,
  insertUser,
  MongoConnect,
  doesUserExists,
  insertGroup,
  doesFieldExist,
  insertMessages,
  findAndInsertGroupPrivate,
  insertMessagesPrivate,
} = require("./Mongo");

app.post(
  "/socket",
  body("name").custom(async (value, { req }) => {
    console.log(req.body, "req.body");
  }),
  body("name", "name should atleast be of 1 character")
    .exists()
    .trim()
    .isLength({ min: 1 }),
  body(
    "name",
    "name can only contain alphabets and numbers, no special character"
  ).isAlphanumeric(),
  body("pwd", "password should be of atleast 6 chars")
    .exists()
    .isLength({ min: 6 }),
  body("name").custom(async (value, { req }) => {
    let result = await doesUserExists(value);
    if (!result && req.body.process == "login") {
      return Promise.reject("user name does not exist, sign up first!");
    }
    if (req.body.process == "signup") {
      if (result ? true : false) {
        return Promise.reject(
          "username already exists, try again with a different user name "
        );
      }
    }
  }),
  body("pwd").custom(async (value, { req }) => {
    if (req.body.process == "login") {
      let result = await doesUserExists(req.body.name);
      if (result && result.pwd !== value) {
        return Promise.reject("wrong password");
      }
    }
  }),
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.process == "signup") {
      let results = await insertUser(req.body.name, req.body.pwd);
    }
    res.sendStatus(200);
    console.log(req.body.name, "connected");
  }
);

app.post(
  "/joinGroup",
  body("group", "group name should be atleast 1 character in length")
    .exists()
    .trim()
    .isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.sendStatus(200);
    console.log("post called group");
  }
);
app.post(
  "/privateChat",
  body("connectTo", "username should be atleast 1 character in length")
    .exists()
    .trim()
    .isLength({ min: 1 }),
  body("connectTo").custom(async (value, { req }) => {
    let userExists = await doesUserExists(value);
    if (!userExists) {
      return Promise.reject("user doesn't exist");
    }
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    let groupName = await findAndInsertGroupPrivate(
      req.body.connectTo,
      req.body.currUser
    );
    res.end(JSON.stringify({groupName:groupName}))
  }
);

io.use((socket, next) => {
  const socketID = socket.handshake.auth.sessionID;
  console.log(socket.handshake);
  console.log(socketID);
  if (socketID != "undefined" && socketID != null && socketID != "") {
    socket.id = socketID;
  }
  next();
});

io.on("connection", (socket) => {
  console.log(socket.id, " connected");

  socket.emit("join", { socketID: socket.id });

  socket.on("join", async (data) => {
    console.log("join called", data);
    socket.join(data.currGroup);
    if (data.private == 0) {
      let results = await insertGroup(data.currGroup);
    }
    io.emit("joinMessage", `${data.user} has joined group ${data.currGroup} !`);
  });

  socket.on('joinCommon',(data,callback)=>{
    socket.join(data.currGroup);
    callback({status:"ok"})
  });

  socket.on("chat", async (msg) => {
    io.to(msg.currGroup).emit("chat", `${msg.user}:${msg.data}`);
    let results = await insertMessages(msg.currGroup, {
      [msg.user]: msg.data,
    });
    console.log(results);
    console.log("message: ", `${msg.user}:${msg.data}:${msg.currGroup}`);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

httpServer.listen(3001, async () => {
  console.log("starting server");
  let gg = await MongoConnect();
  console.log(gg);
  console.log("listening on *:3001");
});
