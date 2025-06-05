import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const connection = await connect(
      process.env.MONGODB_URL_LOCAL || MONGODB_ATLAS_URL
    );
    console.log("Connected to MongoDB", connection.connection.db.databaseName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
