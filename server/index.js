import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
//for google auth
import passport from "./google.js";
import session from "express-session";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// CORS for Express HTTP routes (auth endpoints)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: "whiteboardsecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Redirect to Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(req.user, "jwtsecret", {
      expiresIn: "1d",
    });

    // Redirect to frontend with token
    res.redirect(`${CLIENT_URL}/login-success?token=${token}`);
  }
);

const rooms = {};

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {

  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push({
      id: socket.id,
      name: name,
    });

    io.to(roomId).emit("users-in-room", rooms[roomId]);
  });

  // 🔥 CHAT SYNC
  socket.on("send-message", ({ roomId, message }) => {
    io.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(
        (user) => user.id !== socket.id
      );

      io.to(roomId).emit("users-in-room", rooms[roomId]);
    }
  });

  //for real time whiteboard
  // START DRAWING
  socket.on("start-drawing", ({ roomId, data }) => {
    socket.to(roomId).emit("start-drawing", data);
  });

  // DRAW
  socket.on("draw", ({ roomId, data }) => {
    socket.to(roomId).emit("draw", data);
  });

  // STOP DRAWING
  socket.on("stop-drawing", ({ roomId }) => {
    socket.to(roomId).emit("stop-drawing");
  });

  // CLEAR BOARD
  socket.on("clear-board", ({ roomId }) => {
    socket.to(roomId).emit("clear-board");
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
















// import express from 'express';
// import http from 'http';
// import {Server} from 'socket.io';
// import cors from 'cors';

// const app=express();
// const server=http.createServer(app);

// const rooms = {};

// const io=new Server(server,{
//     cors:{
//         origin:"http://localhost:5173",
//         method:["GET","POST"],
//     },
// });

// io.on('connection',(socket)=>{
//     console.log("User connected:",socket.id);

//     socket.on("join-room",({roomId,name})=>{
//         socket.join(roomId);

//         if(!rooms[roomId]){
//             rooms[roomId]=[];
//         }

//         rooms[roomId].push({
//             id:socket.id,
//             name:name,
//         });

//         console.log(`${name} joined room ${roomId}`);

//         io.to(roomId).emit("user-in-room",rooms[roomId]);
//     });

//     socket.on("disconnect",()=>{
//         console.log("USer disconnected:",socket.id);

//         for(const roomId in rooms){
//             rooms[roomId]=rooms[roomId].filter(
//                 (user)=>user.id!==socket.id
//             );
//             io.to(roomId).emit("user-in-room",roms[roomId]);
//         }
//     })
// })


// server.listen(3000,()=>{
//     console.log("server running on port :http://localhost:3000");
// })




// import dotenv from "dotenv";
// dotenv.config();

// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// //for google auth
// import passport from "./google.js";
// import session from "express-session";
// import jwt from "jsonwebtoken";

// const app = express();
// const server = http.createServer(app);

// app.use(
//   session({
//     secret: "whiteboardsecret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // Redirect to Google
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Callback
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {

//     const token = jwt.sign(req.user, "jwtsecret", {
//       expiresIn: "1d",
//     });

//     const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
//     // Redirect to frontend with token
//     res.redirect(`${CLIENT_URL}/login-success?token=${token}`);
//   }
// );

// const rooms = {};

// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// const io = new Server(server, {
//   cors: {
//     origin: CLIENT_URL,
//     methods: ["GET", "POST"],
//   },
// });

// io.on('connection', (socket) => {

//   socket.on("join-room", ({ roomId, name }) => {
//     socket.join(roomId);

//     if (!rooms[roomId]) {
//       rooms[roomId] = [];
//     }

//     rooms[roomId].push({
//       id: socket.id,
//       name: name,
//     });

//     io.to(roomId).emit("users-in-room", rooms[roomId]);
//   });

//   // 🔥 CHAT SYNC
//   socket.on("send-message", ({ roomId, message }) => {
//     io.to(roomId).emit("receive-message", message);
//   });

//   socket.on("disconnect", () => {
//     for (const roomId in rooms) {
//       rooms[roomId] = rooms[roomId].filter(
//         (user) => user.id !== socket.id
//       );

//       io.to(roomId).emit("users-in-room", rooms[roomId]);
//     }
//   });

//   //for real time whiteboard
//   // START DRAWING
// socket.on("start-drawing", ({ roomId, data }) => {
//   socket.to(roomId).emit("start-drawing", data);
// });

// // DRAW
// socket.on("draw", ({ roomId, data }) => {
//   socket.to(roomId).emit("draw", data);
// });

// // STOP DRAWING
// socket.on("stop-drawing", ({ roomId }) => {
//   socket.to(roomId).emit("stop-drawing");
// });

//  // CLEAR BOARD
// socket.on("clear-board", ({ roomId }) => {
//   socket.to(roomId).emit("clear-board");
// });

// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });















