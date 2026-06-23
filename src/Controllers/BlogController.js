import cloudinary from "cloudinary";
import { uploadImage } from "../Config/cloudinary.js";
import Blog from "../Models/BlogSchema.js";

const createBlog = async (req, res) => {
  try {
    console.log('=== CREATE BLOG STARTED ===');
    console.log('req.file--->', req.file);
    console.log('req.body--->', req.body);

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: false,
        message: "Title and content are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Image is required",
      });
    }

    try {
      console.log('Uploading image...');
      const checkImage = await uploadImage(req.file);
      console.log("checkImage--->", checkImage);

      if (!checkImage || !checkImage.image) {
        return res.status(500).json({
          status: false,
          message: "Failed to upload image",
        });
      }

      const blogData = {
        title,
        content,
        image: checkImage.image,
        author: req.user._id || req.user.id,
        public_id: checkImage.public_id,
      };
      console.log("Blog data--->", blogData);

      // Save data in database
      const savedBlog = await Blog.create(blogData);
      console.log("Saved blog:", savedBlog);

      return res.status(200).json({
        status: true,
        message: "Blog created successfully",
        data: savedBlog,
      });
    } catch (uploadError) {
      console.log('Image upload error:', uploadError);
      return res.status(500).json({
        status: false,
        message: "Failed to upload image: " + uploadError.message,
      });
    }
  } catch (error) {
    console.log("Error in creating blog--->", error);
    return res.status(500).json({
      status: false,
      message: "Error in creating blog: " + error.message,
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Blog id to delete --->", id);

    //Check blog exits in database or not
    const blog = await Blog.findById(id);

    //if blog does not exists
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found in database",
      });
    }

    console.log("Found blog:", blog);
    console.log("Cloudinary public_id:", blog.public_id);

    const deletImg = await cloudinary.v2.uploader.destroy(blog.public_id, {
      resource_type: "image",
    });
    await Blog.findByIdAndDelete(id);
    return res.status(200).json({
      status: true,
      message: "Blog deleted successfully",
      data: deletImg,
    });
  } catch (error) {
    console.log("Error in deleting blog--->", error);
    return res.status(404).json({
      status: false,
      message: "Error in deleting blog",
    });
  }
};

//Get all blogs with author details
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching blogs",
    });
  }
};

// Get single blog
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    console.log("Error fetching blog:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching blog",
    });
  }
};

// Get user's blogs
const getUserBlogs = async (req, res) => {
  try {
    console.log("req.user in getUserBlogs:", req.user);

    const userId = req.user._id || req.user.id;
    console.log("Looking for blogs with author:", userId);

    // Find blogs where author matches the user ID
    const blogs = await Blog.find({ author: userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    console.log("Found blogs:", blogs.length);

    return res.status(200).json({
      status: true,
      message: "User blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.log("Error fetching user blogs:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching user blogs",
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    console.log('=== UPDATE BLOG STARTED ===');
    console.log('Update blog ID:', id);
    console.log('Title:', title);
    console.log('Content length:', content?.length);
    
    // Find the blog
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }
    
    console.log('Blog found successfully');
    console.log('Current image:', blog.image);
    console.log('Current public_id:', blog.public_id);
    
    // Check if user is the author
    const userId = req.user._id || req.user.id;
    const blogAuthorId = blog.author ? blog.author.toString() : null;
    const currentUserId = userId ? userId.toString() : null;
    
    if (blogAuthorId && blogAuthorId !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to edit this blog",
      });
    }
    
    // Prepare update data
    let updateData = {
      title: title || blog.title,
      content: content || blog.content,
    };
    
    // Handle image upload if a new file is provided
    if (req.file) {
      console.log('New image file detected. Uploading...');
      console.log('File info:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      try {
        // Upload new image to Cloudinary
        const uploadResult = await uploadImage(req.file);
        console.log('Upload result received:', uploadResult);
        
        if (uploadResult && uploadResult.image) {
          // Delete old image from cloudinary if it exists
          if (blog.public_id) {
            try {
              console.log('Deleting old image:', blog.public_id);
              const deleteResult = await cloudinary.v2.uploader.destroy(blog.public_id);
              console.log('Delete result:', deleteResult);
            } catch (deleteError) {
              console.log('Error deleting old image:', deleteError);
              // Continue even if deletion fails
            }
          }
          
          // Update image data
          updateData.image = uploadResult.image;
          updateData.public_id = uploadResult.public_id;
          console.log('Image updated successfully');
          console.log('New image URL:', uploadResult.image);
          console.log('New public_id:', uploadResult.public_id);
        } else {
          console.log('Upload failed - invalid result:', uploadResult);
        }
      } catch (uploadError) {
        console.log('Image upload error:', uploadError);
        console.log('Keeping old image');
        // Keep old image if upload fails
      }
    } else {
      console.log('No new image file provided, keeping existing image');
    }
    
    // Update blog in database
    console.log('Updating blog with data:', updateData);
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    console.log('Blog updated successfully');
    console.log('Updated blog:', updatedBlog);
    
    return res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.log("Error updating blog:", error);
    return res.status(500).json({
      status: false,
      message: "Error updating blog: " + error.message,
    });
  }
};

export {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getUserBlogs,
  updateBlog,
};
