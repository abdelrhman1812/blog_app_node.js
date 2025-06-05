import userModel from "../../../DB/models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json({ message: "success", users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error", msg: error.message, stack: error.stack });
  }
};

export default getUsers;
