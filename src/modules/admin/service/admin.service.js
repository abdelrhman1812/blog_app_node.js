import PostModel from "../../../DB/models/post.model.js";
import userModel from "../../../DB/models/user.model.js";

const getUsers = async (req, res) => {
  const users = await userModel.find();

  res.status(200).json({ message: "success", data: { users } });
};

const getPosts = async (req, res) => {
  const posts = await PostModel.find()
    .populate({
      path: "owner",
      select: "userName",
    })
    .populate({
      path: "comments",
      populate: {
        path: "createdBy",
        select: "userName email",
      },
    });
  res.status(200).json({ message: "success", data: { posts } });
};

export { getPosts, getUsers };
