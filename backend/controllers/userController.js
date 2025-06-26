const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const fs = require("fs");
const path = require("path");

// User Validation check
const uservalidator = [
  // Name validation
  check("username").isLength({ min: 3 }).withMessage("Name must be at least 3 characters!"),

  // Email validation
  check("email").isEmail().withMessage("Must be a valid email").normalizeEmail(),

  // Password validation
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
];

// Add user handler
const deleteImage = (filename) => {
  if (filename) {
    const filePath = path.join(__dirname, "../public/uploads/userAvatar", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

const addUserHandler = async (req, res) => {
  let uploadedImage; // To track the uploaded image filename

  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, "Validation failed", { errors: errors.array() });
    }

    // Check if an image was uploaded
    if (!req.files[0]?.filename) {
      throw createError(400, "Image is required");
    }

    // Save the filename of the uploaded image for potential cleanup
    uploadedImage = req.files[0].filename;

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the user in the database
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      avatar: uploadedImage,
    });

    // Remove the password field before sending the user object
    const userWithoutPassword = await User.findById(user._id).select("-password");

    if (!userWithoutPassword) {
      throw createError(500, "There was a server error while creating the user!");
    }

    // Return success response
    res.status(200).json({
      user: userWithoutPassword,
      message: "User created successfully!",
    });
  } catch (error) {
    // Delete the uploaded image if it exists
    deleteImage(uploadedImage);

    // Return error response
    res.status(error.status || 500).json({
      error: error.message || "Internal Server Error",
      details: error.details || null,
    });
  }
};

//get Login
const getLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      throw createError(400, "Email and Password fields are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(403, "Invalid Email");
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError(403, "Invalid Password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId:  user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY } // Ensure expiry is correctly set
    );

    if (!token) {
      throw createError(500, "Server side error during token generation");
    }

    //user without password
    let userWithoutPassword = await User.findById(user._id).select("-password").populate('blogs');
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    userWithoutPassword = {
      ...userWithoutPassword._doc,
      blogs: userWithoutPassword.blogs.map(blog => ({
        ...blog._doc,
        image: `${baseUrl}/uploads/blogThumbnail/${blog.image}`,
      })),
      avatar: `${baseUrl}/uploads/userAvatar/${userWithoutPassword.avatar}`
    };

    // Set signed cookie with token
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true, // Accessible only by the web server
      signed: true, // Enable signing
      secure: true, //sent only over https
    });

    const io = req.app.get('io');
    
    io.emit('userLoggedIn', userWithoutPassword._id);
    

    // Respond with success
    res.status(200).json({
      token,
      user:userWithoutPassword,
      message: "User login successfully!",
    });
  } catch (error) {
    // Ensure proper status is returned
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      error: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  uservalidator,
  addUserHandler,
  getLogin,
};
