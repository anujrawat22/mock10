const { PostModel } = require("../models/post.model");

exports.allposts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).send({ message: "All posts", posts });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.create_post = async (req, res) => {
  try {
    const { image, text, UserId } = req.body;
    const new_post = await new PostModel({ user: UserId, text, image });
    new_post.save();
    res.status(201).send({ message: "Post created" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.update_post = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserId, image,text } = req.body;
    
    const post = await PostModel.findById(id);
    if (post.user.toHexString() !== UserId) {
     return res.status(401).send({ message: "Unauthorized" });
    } else if(image && text){
        console.log("hello",image,text)
      await PostModel.findOneAndUpdate({_id : id}, {$set : {image,text}});
       res.status(204).send({message : "Post updated sucessfully"});
    }else if(image){
        await PostModel.findByIdAndUpdate(id, {image});
     return res.status(204).send({message : "Post updated sucessfully"});
    }else if(text){
        await PostModel.findByIdAndUpdate(id, {image});
     return res.status(204).send({message : "Post updated sucessfully"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.delete_post = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserId } = req.body;

    const post = await PostModel.findById(id);
    console.log(post.user.toHexString(),UserId)
    if (post.user.toHexString() !== UserId) {
      res.status(401).send({ message: "Unauthorized" });
    } else {
      await PostModel.findByIdAndDelete(id);
      res
        .status(202)
        .send({ message: `Post with id - ${id} deleted sucessfully` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.like_post = async (req, res) => {
  try {
    const { UserId } = req.body;
    const { id } = req.params;
    console.log(id)
    const post = await PostModel.findById(id);
    console.log(post)
    
    post.likes.push(UserId );
    post.save()
    res.status(201).send({ message: `Post with id - ${id} liked` });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.comment_post = async (req, res) => {
  try {
    const { text, UserId } = req.body;
    const { id } = req.params;
    const post = await PostModel.findById(id);
    post.comments.push({ user: UserId, text});
    console.log(post)
    post.save()
    res
      .status(201)
      .send({ message: `comment posted on post with id - ${id} ` });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.get_post_withId = async (req, res) => {
  try {
    const {id} = req.params;
    const post = await PostModel.findById(id);
    res.status(200).send({message : `Post with id - ${id}`,post})
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};
