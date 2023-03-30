const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const salt = +process.env.salt;

const { UserModel } = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { name, email, password, dob, bio } = req.body;

    const userexists = await UserModel.findOne({ email });

    if (userexists) {
      return res
        .status(409)
        .send({ message: "User already exists , Please Login" });
    }

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ Error: err });
      } else {
        const user = await new UserModel({
          name,
          email,
          password: hash,
          dob,
          bio,
        });
        user.save();

        res.status(201).send({ message: "User registered sucessfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User dosen't exists, Please Signup" });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).send({ Error: err });
        }

        if (result) {
          const UserId = user._id;
          const name = user.name;
          const token = jwt.sign(
            { UserId, name, email },
            process.env.Tokensecret,
            { expiresIn: 60 * 60 * 24 * 7 }
          );
          res.cookie("token", token);
          res.status(201).send({ message: "Login Sucessful", token });
        } else {
          res
            .status(401)
            .send({ message: "Incorrect credentials , Please login again" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).send({ message: "All users", users });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.allfriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return res
        .status(404)
        .send({ message: `User with id - ${id} not found` });
    } else {
      const friends = user.friends;
      res.status(200).send({ message: `friends of id - ${id}`, friends });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.sendrequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserId } = req.body;
    const user = await UserModel.findOne({ _id: id });
    if(!user){
      return res.status(404).send({message : `User with id - ${id} not found`})
     }else{
       
       user.friendRequests.push(UserId);
       await user.save()
       res
         .status(201)
         .send({
           message: `Friend request to user with id - ${id} sent sucessfully`,
         });
     }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.request_action = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const { action } = req.query;
    const {UserId } = req.body
    if(id!== UserId){
    return res.status(401).send({message : "Unauthorized"})
    }
    
    const user = await UserModel.findById(id)
    console.log(user)
    for(let i=0;i<user.friendRequests.length;i++){
      if(user.friendRequests[i].toHexString() === friendId && action==='accept'){
        console.log(user.friendRequests[i].toHexString(),friendId)
        user.friendRequests.splice(i,1)
        user.friends.push(friendId)
        user.save()
        return res.status(204).send({message : 'Request accepted'})
      }
      else if(user.friendRequests[i].toHexString() === friendId && action==='reject'){
        user.friendRequests.splice(i,1)
        user.save()
        return res.status(204).send({message : 'Request rejected'})
      }
    }
    res.status(404).send({message : `No request with id - ${id} found`})
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};
