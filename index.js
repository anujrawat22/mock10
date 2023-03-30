const express = require("express");
const { connection } = require("./config/db");
const { authenticate } = require("./middleware/authenticate");
const { PostRouter } = require("./routes/post.route");
const { UserRouter } = require("./routes/user.route");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/users", UserRouter);

app.use("/posts",authenticate,PostRouter)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to Db");
    console.log(`Listening on PORT ${process.env.PORT}`);
  } catch (err) {
    console.log(err);
    console.log("Error connecting to Db");
  }
});
