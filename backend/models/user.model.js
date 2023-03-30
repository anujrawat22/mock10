const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  
  name:{type :  String , required : true},
  email: {type :  String , required : true},
  password: {type :  String , required : true},
  dob: {type :  Date , required : true},
  bio: {type :  String},
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
