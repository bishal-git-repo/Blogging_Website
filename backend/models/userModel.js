const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    blogs: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
    ],
    chats: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }
    ]
  },
  { timestamps: true }
);

// userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
