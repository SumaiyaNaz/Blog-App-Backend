import express from "express";
import multer from "multer";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getUserBlogs,
  updateBlog,
} from "../Controllers/BlogController.js";
import userCheck from "../Middleware/Authmiddle.js";
import { userMiddle } from "../Middleware/AdminMiddleware.js";

const blogroute = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB will be the size of file
  },
});

//upload.single('image') means upload ka function jo hum ny uper banaya hy wo use karo or single file/image save karo or image filed/input name hy jo same hoga jesa hum ny blog schema mein define kia hy
blogroute.post("/create", userCheck, upload.single("image"), createBlog);
blogroute.delete("/delete/:id", userCheck, deleteBlog);
blogroute.get("/", getAllBlogs);
blogroute.get("/my-blogs", userMiddle, getUserBlogs);
blogroute.get("/:id", getBlogById);
blogroute.put(
  "/update/:id",
  userCheck,
  upload.single("image"),
  (req, res, next) => {
    console.log("Multer middleware executed");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    next();
  },
  updateBlog,
);

export default blogroute;
