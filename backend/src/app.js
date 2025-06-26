

const express = require("express");
const cors = require("cors");
const app = express();
const cookie = require("cookie-parser");
const dotenv = require("dotenv");
const createError = require("http-errors")
const http = require('http');

dotenv.config();

//internal modules
const userRouter = require("../routes/userRoute");
const blogRouter = require('../routes/blogRouter');
const authRouter = require('../routes/authRouter')
const checkLogin = require("../utils/checkLogin");
const blogThumbnailUpload = require("../middleware/blogThumbnail");
const userAvatarUpload = require("../middleware/userAvatar");
const chatRouter = require("../routes/chatRouter");


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// Allow only a specific URL for CORS
const allowedOrigin = process.env.FRONTEND_URI; // Replace with your allowed domain

console.log("origin", allowedOrigin);


const corsOptions = {
  origin: function (origin, callback) {
    origin = allowedOrigin
    if (allowedOrigin) {
        // console.log("origin", allowedOrigin);
      callback(null, true);
    } else {
      callback(createError(403,'Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

const {Server} = require('socket.io');

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies in the handshake
  },
});



// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});



// Make io accessible to other files
app.set('io', io); // Store io instance in the app



// app.options('*', cors(corsOptions)); // Handle preflight requests

//use cookie

app.use(cookie(process.env.COOKIE_SECRET));

//user Routes
app.use("/user", userAvatarUpload, userRouter);

//blog routes
app.use("/blog", checkLogin, blogThumbnailUpload, blogRouter);

//auth check
app.use("/auth", checkLogin, authRouter);

//chat routes
app.use("/chat",  checkLogin, chatRouter);

module.exports = server;
