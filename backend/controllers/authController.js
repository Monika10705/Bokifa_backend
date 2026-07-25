const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === "admin") {
      if (email === "admin@bokifa.com" && password === "admin123") {
        const token = jwt.sign(
          {
            role: "admin",
            email: "admin@bokifa.com",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        return res.status(200).json({
          success: true,
          message: "Admin login successful",
          token,
          data: {
            name: "Admin",
            email: "admin@bokifa.com",
            role: "admin",
          },
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
