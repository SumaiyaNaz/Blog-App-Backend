import jwt from "jsonwebtoken";
import Users from "../Models/UserSchema.js";

const userCheck = async (req, res, next) => {
  try {
    // Check token from cookies or authorization header
    const token =
      req.headers?.authorization?.split(" ")[1] ||
      req.cookies.token ||
      req.headers?.cookie?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("decoded--->", decoded);

    // Fetch full user data from database
    const user = await Users.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Attach full user object to request
    req.user = user;
    next();

  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({
      status: false,
      message: error.message || "Authentication failed",
    });
  }
};

export default userCheck;