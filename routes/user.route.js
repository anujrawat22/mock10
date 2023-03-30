const express = require("express");
const {  register, login, getUsers, allfriends, sendrequest, request_action } = require("../controller/user");
const { authenticate } = require("../middleware/authenticate");

const UserRouter = express.Router();

UserRouter.post("/register",register);

UserRouter.post("/login",login);

UserRouter.get("/",authenticate,getUsers)

UserRouter.get("/:id/friends",authenticate,allfriends)

UserRouter.post("/:id/friends",authenticate,sendrequest)

UserRouter.put("/:id/friends/:friendId",authenticate,request_action)

module.exports = { UserRouter };
