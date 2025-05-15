import User2 from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../mailer.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../mailer.js"; // You need to create this function

dotenv.config();
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User2.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    // Save the token + expiration on the user
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}`;
    await sendResetPasswordEmail(email, resetLink);

    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
// Reset Password ✅ (Place this here)
export const resetPassword = async (req, res) => {
  const { token, id, newPassword } = req.body;

  try {
    const user = await User2.findById(id);
    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Register User
export const registerUser = async (req, res) => {
  const { username, role, email, password } = req.body;

  if (!username || !role || !email || !password) {
    return res.status(400).json({ message: "All credentials are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User2.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    //Hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user

    const newUser = await User2.create({
      username,
      role,
      email,
      password: hashedPassword,
    });
    console.log(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, type: "verification" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    //send verification email

    sendVerificationEmail(email, token);

    return res.status(201).json({
      message: "User registered. Verification email sent.",
    });
  } catch (error) {
    console.error("Error occurred in registerUser:", error.message); // Log the error
    res.status(500).json({ message: error.message });
  }
};
export const verifyUser = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.type !== "verification") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const userId = decoded.id;

    // Find the user by ID
    const user = await User2.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's verification status
    user.isVerified = true;

    await user.save(); // Save the updated user

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // find the user by username
    const user = await User2.findOne({ username });
    console.log("User found", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if the user is verified

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please verify your email",
      });
    }

    // check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token with userId included
    const token = jwt.sign(
      { userId: user._id, type: "auth", isLogged: true },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.log(error.message); // Log the error
    res.status(500).send({ message: error.message });
  }
};
