import dotenv from "dotenv";
import connectDB from "./DB/db.connections.js";
import authRouter from "./modules/auth/auth.controller.js";
import postsRouter from "./modules/posts/post.controller.js";
import usersRouter from "./modules/users/user.controller.js";

dotenv.config({ path: "./config/.env" });

const bootstrap = (app, express) => {
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  app.get("/", (req, res) => {
    return res.send("Hello form my Blog  ");
  });

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/posts", postsRouter);

  app.all(/^.*$/, (req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  connectDB();
};

export default bootstrap;
