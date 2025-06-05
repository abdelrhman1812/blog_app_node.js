import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../../DB/models/userModel.js";
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

  res.status(200).json({ message: "success", user });
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
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );

  return res.status(200).json({ message: "success", token });
};

export { signin, signup };
