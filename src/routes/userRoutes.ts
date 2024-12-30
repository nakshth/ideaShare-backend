import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
  logoutUser,
  updateUserStatus,
} from "../controllers/userController";

const router = express.Router();
// Create a new user
router.post("/", createUser); // The POST method to create a new user

// Get all users
router.get("/", getUsers); // The GET method to get all users

// Get a user by ID
router.get("/:id", getUserById); // The GET method to get a user by ID

// Update a user by ID
router.put("/:id", updateUser); // The PUT method to update a user by ID

// Delete a user by ID
router.delete("/:id", deleteUser); // The DELETE method to delete a user by ID

router.post('/login', loginUser);

// GET route for user profile (authentication check)
router.get('/profile', getProfile);

// GET route for user logout
router.get('/logout', logoutUser);
router.put("/:userId/status", updateUserStatus);

export default router;
