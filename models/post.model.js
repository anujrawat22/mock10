const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: {type : String},
  image: {type : String,required : true},
  createdAt: {type : Date,default : Date.now()},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt:{type : Date,default : Date.now()},
    },
  ],
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = { PostModel };
