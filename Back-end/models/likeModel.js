 import mongoose from "mongoose";

//this is like blog
const LikeSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  }
}, { timestamps: true });

// ✅ Prevent duplicate likes for same user-blog pair
LikeSchema.index({ User: 1, blog: 1 }, { unique: true });

const LikeBlog = mongoose.model("LikeBlog", LikeSchema);

export default LikeBlog;