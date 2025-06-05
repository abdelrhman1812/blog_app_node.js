import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import { getLoggedInUserPosts } from "./service/post.service.js";

const postsRouter = Router();

postsRouter.get("/", catchError(getLoggedInUserPosts));

export default postsRouter;
