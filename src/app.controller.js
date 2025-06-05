import dotenv from "dotenv";
import connectDB from "./DB/db.connections.js";

dotenv.config({ path: "./config/.env" });

const bootstrap = (app, express) => {
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  app.get("/", (req, res) => {
    return res.send("Hello form my Blog  ");
  });

  app.all(/^.*$/, (req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  connectDB();
};

export default bootstrap;
