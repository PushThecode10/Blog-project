import mongoose from "mongoose";

const connnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting to the database", error);
  }
};
export default connnectDb;
