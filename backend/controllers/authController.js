const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/mail");

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

const testEmail = async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bokifa" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Bokifa Nodemailer Test",
      text: "Nodemailer is working successfully!",
    });

    console.log("Email sent:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

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
          },
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
      },
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

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const newEmail = email?.toLowerCase().trim();

    // Email must not be changed through this endpoint.
    if (
      newEmail &&
      newEmail !== req.user.email.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email changes require OTP verification.",
      });
    }

    req.user.name = name.trim();

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Don't reveal whether an email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store HASH of token in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token expires after 15 minutes
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Link contains the RAW token.
    // Database contains only the HASH.
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Bokifa" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Bokifa Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Reset Your Password</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your Bokifa account password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background: #1a6b3a;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <p>
            Regards,<br />
            Bokifa Team
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash the token received from the URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Invalidate the reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const sendEmailChangeOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "New email is required",
      });
    }

    const newEmail = email.toLowerCase().trim();

    // If the email hasn't changed
    if (newEmail === req.user.email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "This is already your current email",
      });
    }

    // Check whether another account already uses this email
    const existingUser = await User.findOne({
      email: newEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Store a hash of the OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    req.user.pendingEmail = newEmail;
    req.user.emailChangeOtp = hashedOtp;

    // OTP valid for 10 minutes
    req.user.emailChangeOtpExpire = Date.now() + 10 * 60 * 1000;

    await req.user.save();

    await transporter.sendMail({
      from: `"Bokifa" <${process.env.EMAIL_USER}>`,
      to: newEmail,
      subject: "Verify Your New Bokifa Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Verify Your New Email</h2>

          <p>Hello ${req.user.name},</p>

          <p>
            You requested to change the email address associated with your
            Bokifa account.
          </p>

          <p>Your verification code is:</p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 20px 0;
            "
          >
            ${otp}
          </div>

          <p>
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request this change, please ignore this email.
          </p>

          <p>
            Regards,<br />
            Bokifa Team
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your new email address",
    });
  } catch (error) {
    console.error("SEND EMAIL CHANGE OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to send verification OTP",
    });
  }
};

const verifyEmailChangeOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    if (!req.user.pendingEmail || !req.user.emailChangeOtp) {
      return res.status(400).json({
        success: false,
        message: "No email change request found",
      });
    }

    if (
      !req.user.emailChangeOtpExpire ||
      req.user.emailChangeOtpExpire < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    if (hashedOtp !== req.user.emailChangeOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Final check in case someone registered this email
    // while the OTP was pending.
    const existingUser = await User.findOne({
      email: req.user.pendingEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Change the email
    req.user.email = req.user.pendingEmail;

    // Clear OTP data
    req.user.pendingEmail = null;
    req.user.emailChangeOtp = null;
    req.user.emailChangeOtpExpire = null;

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("VERIFY EMAIL CHANGE OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  testEmail,
  forgotPassword,
  resetPassword,
  sendEmailChangeOtp,
  verifyEmailChangeOtp,
};
