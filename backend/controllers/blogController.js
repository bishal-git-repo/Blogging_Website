const createError = require("http-errors");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");


//add blog
const addBlogHandler = async (req, res) => {
    try {
        const { title, description} = req.body;

        // Validation
        if (!title || !description) {
            throw createError(400, "All fields are required");
        };

        // Validate uploaded file
        if (!req.files[0].filename) {
            throw createError(400, "Image is required");
        }

        // Create blog
        const blog = await Blog.create({
            ...req.body,
            image: req.files[0].filename,
            author: req.user.userId,
        });

        if (!blog) {
            throw createError(500, "There was a server-side error while creating the blog");
        }

        // Update user's blogs array
        const user = await User.findById(req.user.userId);
        if (!user) {
            throw createError(404, "User not found");
        }

        user.blogs.push(blog._id);
        await user.save();

        // Populate author field
        // await blog.populate('author');

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Emit the 'newBlogAdded' event to all connected clients
        const io = req.app.get('io'); // Access io instance from the app
        io.emit('newBlogAdded', {
          ...blog._doc, // Spread only the document data, excluding metadata
          image: `${baseUrl}/uploads/blogThumbnail/${blog.image}` // Add the full path to the image
        });

        // Send success response
        res.status(200).json({
            blog,
            message: "Blog created successfully!",
        });
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "An error occurred while creating the blog",
        });
    }
};


//edit blog
const editBlogHandler = async (req, res) => {
  try {
      const blogId = req.params.id;
      const { title, description } = req.body; // Expect image as a URL string

      // Validation
      if (!title || !description) {
          throw createError(400, "All fields are required");
      }

      // Check if blog exists
      const blog = await Blog.findById(blogId);
      if (!blog) {
          throw createError(404, "Blog not found");
      }

      // Check if the user is the author of the blog
      if (blog.author.toString() !== req.user.userId) {
          throw createError(403, "You are not authorized to edit this blog");
      }

      // If image URL is provided, update it, otherwise leave the existing one
      const data = {
        title,
        description,
        image: req.files?.[0]?.filename || blog.image,  // If no new image URL, retain the existing one
      };

      // Update blog
      const updatedBlog = await Blog.findByIdAndUpdate(blogId, data, { new: true });

      if (!updatedBlog) {
          throw createError(500, "There was a server-side error while updating the blog");
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const io = req.app.get('io'); // Access io instance from the app
        io.emit('editedBlog', {
          ...updatedBlog._doc, // Spread only the document data, excluding metadata
          image: `${baseUrl}/uploads/blogThumbnail/${updatedBlog.image}` // Add the full path to the image
        });

      // Send success response
      res.status(200).json({
          updatedBlog,
          message: "Blog updated successfully!",
      });
  } catch (error) {
      res.status(error.status || 500).json({
          error: error.message || "An error occurred while updating the blog",
      });
  }
};

const deleteBlogHandler = async (req, res) => {
  try {
      const blogId = req.params.id;

      // Check if blog exists
      const blog = await Blog.findById(blogId);
      if (!blog) {
          throw createError(404, "Blog not found");
      }

      // Check if the user is the author of the blog
      if (blog.author.toString() !== req.user.userId) {
          throw createError(403, "You are not authorized to delete this blog");
      }

      // Delete blog
      const deletedBlog = await Blog.findByIdAndDelete(blogId);

      if (!deletedBlog) {
          throw createError(500, "There was a server-side error while deleting the blog");
      }

      // Update user's blogs array
      const user = await User.findById(req.user.userId);
      if (!user) {
          throw createError(404, "User not found");
      }

      user.blogs = user.blogs.filter(blog => blog.toString() !== blogId);
      await user.save();

      // const baseUrl = `${req.protocol}}://${req.get('host')}`;

      const io = req.app.get('io'); // Access io instance from the app
        io.emit('deletedBlog', {
          deletedBlog
          // ...deletedBlog._doc, // Spread only the document data, excluding metadata
          // image: `${baseUrl}/uploads/blogThumbnail/${deletedBlog.image}` // Add the full path to the image
        });

      // Send success response
      res.status(200).json({
          deletedBlog,
          message: "Blog deleted successfully!",
      });
  } catch (error) {
      res.status(error.status || 500).json({
          error: error.message || "An error occurred while deleting the blog",
      });
  }
};



//get blogs
const getBlogsHandler = async (req, res) => {
    try {
      const data = await Blog.find();

      // Construct the base URL dynamically
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // Map through the data, modifying the image property and excluding Mongoose metadata
      let blogs = data.map(blog => ({
        ...blog._doc, // Spread only the document data, excluding metadata
        image: `${baseUrl}/uploads/blogThumbnail/${blog.image}` // Add the full path to the image
      }));
  
      if (!blogs) {
        throw createError(500, "Server error while fetching blogs!");
      }
  
      res.status(200).json({
        blogs,
        message: "Blogs successfully fetched!"
      });
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message || "Failed to fetch Blogs!"
      });
    }
};

  
//get particular blog
const blogDetail = async(req, res)=>{
  try {
    const blogId = req.params.id
    const data = await Blog.findOne({_id: blogId}).populate('author', 'username -_id');

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const blog = {...data._doc, image: `${baseUrl}/uploads/blogThumbnail/${data.image}`}

    

    if (!blog) {
      throw createError(500, "Server error while fetching blog details!")
    }
    res.status(200).json({
      blog,
      message: "Blog Details successfully fetched!"
    })
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "Failed to fetch Blog details!"
    });
  }

}



module.exports = {
    addBlogHandler,
    getBlogsHandler,
    blogDetail,
    editBlogHandler,
    deleteBlogHandler,
}