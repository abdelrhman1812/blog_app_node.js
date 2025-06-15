import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import userModel from "../../../DB/models/user.model.js";
import sendEmails from "../../../service/email.js";
import AppError from "../../../utils/appError.js";

/* ============================== Register ============================== */
const signup = async (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new AppError("password does not match", 400));
  }

  const userIsExist = await userModel.findOne({ email, password });
  if (userIsExist) {
    return next(new AppError("user already exist", 409));
  }

  const hashPassword = bcrypt.hashSync(password, 8);

  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });

  res.status(200).json({ message: "success", success: true, date: { user } });
};

/* ============================== Login  ============================== */

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("user is not exist", 404));
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new AppError("invalid email or password", 400));
  }

  const token = jwt.sign(
    {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY
    // {
    //   expiresIn: "24h",
    // }
  );

  return res
    .status(200)
    .json({ message: "success", success: true, data: { token } });
};

/* ============================== Forgot Password ============================== */

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  /* Check If User Exist */
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError("user is not exist", 404));

  /* Generate New Code */
  const code = customAlphabet("1234567890", 6);
  const newCode = code();

  /* Send Email */
  await sendEmails(
    email,
    "Forget Password",
    `<h1>Your code is ${newCode}</h1>`,
    res
  );

  /* Update User Code */
  await userModel.updateOne({ _id: user._id }, { code: newCode });

  return res.json({ message: "success", success: true });
};

/* =============================== Reset Password ===============================  */

const resetPassword = async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  /* Check If User Exist */
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) return next(new AppError("user is not exist", 404));

  /* Compare Code */
  if (user.code !== code) return next(new AppError("invalid code", 401));

  /* Change Password */

  const hashPassword = bcrypt.hashSync(newPassword, 8);

  user.password = hashPassword;
  user.code = "";

  /* Update User Password */

  await user.save();

  return res.json({ message: "success reset password", success: true });
};

export { forgotPassword, resetPassword, signin, signup };
