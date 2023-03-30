const express = require("express")
const { allposts, create_post, update_post, delete_post, like_post, comment_post, get_post_withId } = require("../controller/post")


const PostRouter  = express.Router()

PostRouter.get("/",allposts)

PostRouter.post("/",create_post)

PostRouter.put("/:id",update_post)

PostRouter.delete("/:id",delete_post)

PostRouter.post("/:id/like",like_post)

PostRouter.post("/:id/comment",comment_post)

PostRouter.get("/:id",get_post_withId)

module.exports = {PostRouter}