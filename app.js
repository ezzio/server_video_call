const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
var mongoose = require("mongoose");
// var User_Schema = require("./public/db/schema/User_Schema");
// const login_github = require("./login_github");
const connection = require("./public/db/configmongoose");
const passport = require("passport");
const session = require("cookie-session");
const server = require("http").createServer(app);
const PORT = process.env.PORT || 8000;
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const useRouter = require("./routes/usersInfo");
const RoomMeetingRouter = require("./routes/RoomMeeting");
const photoRouter = require("./routes/photo");

let users = [];
// view engine setup
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
connection();
app.use(
  session({
    secret: "zxzxczcasd",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: 10000 * 60 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/user", useRouter);

app.use("/photo", photoRouter);
app.use("/MeetingRoom", RoomMeetingRouter);
io.on("connection", (socket) => {
  socket.on("create_room", (data, UserRoom) => {
    socket.idUser = data.UserRoom;
    socket.room_id = data.RoomId;
    users.push({ Room: data.RoomId, Data: "Host", idUser: data.UserRoom });
    socket.join(data.RoomId);
  });
  socket.on("join_room", async (data) => {
    socket.join(data.room_id);
    socket.idUser = data.ownerId;
    socket.room_id = data.room_id;
    let index = users.findIndex((user) => user.idUser === socket.idUser);
    if (index == -1) {
      users.push({
        socketId: socket.id,
        username: data.username,
        RoomJoin: data.room_id,
        avatar: data.avatar,
        idUser: data.ownerId,
        peerId: data.peerId,
        camera: data.camera || true,
        audio: data.audio || true,
      });
    } else {
      users[index].socketId = socket.id;
      users[index].peerId = data.peerId;
    }
    let infoAllMemberInRoom = users.filter(
      (eachUser) => eachUser.RoomJoin === data.room_id
    );
    // infoAllMemberInRoom.map((items) => {
    console.log(infoAllMemberInRoom);
    socket.to(data.room_id).emit("totalInfoMemberInRoom", infoAllMemberInRoom);
    // for (const item of infoAllMemberInRoom) {
    //   console.log(item.socketId);

    // }

    // socket.to(data.room_id).emit("SomeOneJoin", users);

    socket.to(data.room_id).emit("newUserJoin", {
      RoomJoin: data.room_id,
      message: data.username + " Vừa Join vào room",
      userName: data.username,
      idUser: data.ownerId,
    });
  });

  socket.on("close_camera", (userClose) => {
    console.log("vua dong camera");
    console.log(userClose);
    socket.to(userClose.currentRoom).emit("SomeOneCloseCamara", userClose);
  });

  socket.on("disconnect", async () => {
    let index = await users.findIndex((user) => user.socketId == socket.id);
    if (index != -1) {
      let infoSomeOneDisconnect = users[index];
      const a1 = users.slice(0, index);
      const a2 = users.slice(index + 1, users.length);
      const new_arr = a1.concat(a2);
      users = new_arr;
      io.to(socket.room_id).emit("someOneDisconnect", {
        messages: infoSomeOneDisconnect.username + " vừa thoát khỏi phòng",
        idUserDisconnect: infoSomeOneDisconnect.idUser,
        usersCurrentInroom: users,
      });
    }
  });
});

server.listen(PORT, () => console.log("server is running at port " + PORT));
