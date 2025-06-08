/* Uncaught Exception */
process.on("uncaughtException", (err) => {
  console.log("err in code", err);
});
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

import express from "express";
import bootstrap from "./src/app.controller.js";
import connectDB from "./src/DB/db.connections.js";
import globalErrorHandler from "./src/utils/globalError.js";

const app = express();
const port = process.env.PORT || 3000;

bootstrap(app, express);

app.use(globalErrorHandler);

/* Unhandled Rejection */
process.on("unhandledRejection", (err) => {
  console.log("error", err);
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

connectDB();

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use`);
  }
});
