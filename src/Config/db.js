import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log(
    //   "Checking connection string of db --->",
    //   process.env.CONNECTIONSTRING,
    // );
    await mongoose.connect(process.env.CONNECTIONSTRING);
    console.log("Mongo db is connected");
  } catch (error) {
    console.log("Error in connecting db ---> ", error);
  }
};

export default connectDB;
