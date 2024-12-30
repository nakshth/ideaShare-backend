import { Router } from "express";
import {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  updateIdeaStatus,
  getIdeasByUser,
  giveReward,
  likeIdea,
  unlikeIdea,
  addComment,
  fetchIdeasWithUserInfo,
} from "../controllers/ideaController";
import { getAllIdeaCount } from "../controllers/allIdeaCountController";

const router: Router = Router();

// Idea Routes
router.post("/", createIdea); // Submit an idea
router.get("/", getIdeas); // Get all ideas
router.get("/:id/user", getIdeasByUser); // Get all ideas
router.get("/:id", getIdeaById); // Get an idea by ID
router.put("/:id", updateIdea); // Update an idea
router.delete("/:id", deleteIdea); // Delete an idea
router.put("/:id/status", updateIdeaStatus); // Update idea status
router.get("/all/ideaCount", getAllIdeaCount); // Get an idea by ID
router.patch("/:id/reward", giveReward);
router.post("/:id/like", likeIdea); // Like an idea
router.post("/:id/unlike", unlikeIdea); // Unlike an idea
router.post("/:id/comment", addComment); // Add a comment
router.get("/indeaInfo/WithUserInfo", fetchIdeasWithUserInfo); // Add a comment
export default router;
