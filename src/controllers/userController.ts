import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import { NextFunction } from "express";
import passport from "passport";
import { Schema } from "mongoose";
// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      profileImage,
      email,
      role,
      profie,
      mobile,
      password,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      profileImage,
      email,
      role,
      profie,
      mobile,
      password: hashedPassword,
    });

    // Respond with the created user
    res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update user details
export const updateUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      profileImage,
      email,
      role,
      profie,
      mobile,
      password,
    } = req.body;

    // Find user by ID and update
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        profileImage,
        email,
        role,
        profie,
        mobile,
        password,
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    // Respond with the updated user
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    async (err: { message: any }, user: any, info: { message: any }) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (!user) {
        return res.status(400).json({ success: false, message: info.message });
      }

      try {
        // Check user status
        const foundUser = await User.findById(user._id);
        if (!foundUser) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        if (foundUser.status !== "Active") {
          return res.status(403).json({
            success: false,
            message: "Your account is disabled. Please contact support.",
          });
        }

        // If user is authenticated and active, log them in
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: err.message });
          }
          res.status(200).json({
            success: true,
            message: "Login successful",
            user: user,
          });
        });
      } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
          success: false,
          message: "An error occurred. Please try again later.",
        });
      }
    }
  )(req, res, next);
};

// Profile check function
export const getProfile = (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }

  res.status(200).json({ success: true, user: req.user });
};

// Logout function
export const logoutUser = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Get user ID from route parameter
    const { status } = req.body; // Get new status from request body

    // Validate status
    if (!["Active", "Disabled"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
