import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import { getPosts, getUsers } from "./service/admin.service.js";

const adminRouter = Router();

adminRouter.get("/users", catchError(getUsers));

adminRouter.get("/posts", catchError(getPosts));

export default adminRouter;
