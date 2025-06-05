import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import { validation } from "../../middleware/validation.js";
import { signinValidation, signupValidation } from "./auth.validation.js";
import { signin, signup } from "./service/registration.service.js";

const authRouter = Router();

authRouter.post("/signup", validation(signupValidation), catchError(signup));
authRouter.post("/signin", validation(signinValidation), catchError(signin));

export default authRouter;
