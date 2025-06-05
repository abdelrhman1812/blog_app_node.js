import { Router } from "express";
import getUsers from "./service/user.service.js";

const usersRouter = Router();

usersRouter.get("/", getUsers);

export default usersRouter;
