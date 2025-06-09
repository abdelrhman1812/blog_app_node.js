process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

import cors from "cors";
import express from "express";
import bootstrap from "./src/app.controller.js";
import connectDB from "./src/DB/db.connections.js";
import globalErrorHandler from "./src/utils/globalError.js";

const app = express();
const port = process.env.PORT || 3000;

/* ===== Apply middlewares ===== */
app.use(cors());
bootstrap(app, express);
app.use(globalErrorHandler);

/* ===== Start Server ===== */
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(port, () =>
      console.log(` Server running on port ${port}`)
    );

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use`);
      }
    });
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
