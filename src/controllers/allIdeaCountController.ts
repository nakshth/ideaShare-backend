// controllers/employeeController.ts
import { Request, Response } from "express";
import Idea from "../models/IdeaModel";
import User from "../models/userModel";

// Get detailed employee stats (ideas count, rewards, categorized ideas, etc.)
export const getAllIdeaCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetching ideas submitted by the employee
    const totalIdeaList = await Idea.find();
    const totalUsers = await User.find();
    const employeeList = totalUsers.filter(
      (ele) => ele.role == "EMPLOYEE"
    );
    const innovationManagerList = totalUsers.filter(
      (ele) => ele.role == "INNOVATION MANAGER"
    );
    const decisionMakerList = totalUsers.filter(
      (ele) => ele.role == "DECISION MAKER"
    );
    // Categorizing ideas
    const innovations = totalIdeaList.filter(
      (ele) => ele.category == "Innovation"
    );
    const costSaving = totalIdeaList.filter(
      (ele) => ele.category == "Cost-Saving"
    );
    const productivity = totalIdeaList.filter(
      (ele) => ele.category == "Productivity"
    );
    const submitted = totalIdeaList.filter((ele) => ele.status == "Submitted");
    const inprogress = totalIdeaList.filter(
      (ele) => ele.status == "In Progress"
    );
    const approved = totalIdeaList.filter((ele) => ele.status == "Approved");
    const rejected = totalIdeaList.filter((ele) => ele.status == "Rejected");

    // Total ideas count
    const totalIdeaCount = totalIdeaList.length || 1; // Avoid division by zero

    // Calculating percentages
    const detailedStats = {
      totalIdeaCount,
      totalUser: totalUsers.length,
      employeeCount: employeeList.length,
      innovationsCount: innovations.length,
      productivityCount: productivity.length,
      costSavingCount: costSaving.length,
      submittedCount: submitted.length,
      inprogressCount: inprogress.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      decisionManagerCount:decisionMakerList.length,
      innovationManagerCount:innovationManagerList.length,
      innovationPercentage: ((innovations.length / totalIdeaCount) * 100).toFixed(2),
      costSavingPercentage: ((costSaving.length / totalIdeaCount) * 100).toFixed(2),
      productivityPercentage: ((productivity.length / totalIdeaCount) * 100).toFixed(2),
      submittedPercentage: ((submitted.length / totalIdeaCount) * 100).toFixed(2),
      inprogressPercentage: ((inprogress.length / totalIdeaCount) * 100).toFixed(2),
      approvedPercentage: ((approved.length / totalIdeaCount) * 100).toFixed(2),
      rejectedPercentage: ((rejected.length / totalIdeaCount) * 100).toFixed(2),
    };

    res.status(200).json(detailedStats);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching employee stats", error: error.message });
  }
};
