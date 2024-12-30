// routes/employeeStatusRoute.ts
import express from "express";
import { getEmployeeStats } from "../controllers/employeeController";

const router = express.Router();

// Route to get employee statistics (ideas count, rewards, categorized ideas, etc.)
router.get("/:employeeId/stats", getEmployeeStats);

export default router;
