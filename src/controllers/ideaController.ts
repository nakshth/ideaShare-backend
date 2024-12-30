import { Request, Response } from "express";
import Idea, { IIdea } from "../models/IdeaModel";
import Feedback from "../models/Feedback";
import { Schema } from "mongoose";

// Submit a new idea
export const createIdea = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, category, submittedBy, files } = req.body; // File URLs passed directly from frontend

  try {
    const newIdea: IIdea = new Idea({
      title,
      description,
      category,
      submittedBy,
      files: files || [], // Save file URLs or default to an empty array
    });

    const savedIdea = await newIdea.save();
    res.status(201).json({ success: true, data: savedIdea });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating idea", error: error.message });
  }
};

// Get all ideas
export const getIdeas = async (req: Request, res: Response): Promise<void> => {
  try {
    const ideas = await await Idea.find()
      .populate({
        path: "likes", // Populate likes field with user details
        select: "firstName lastName profileImage email role", // Specify fields to include from User
      })
      .sort({ updatedAt: -1 });
    res.status(200).json(ideas);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching ideas", error: error.message });
  }
};

// Get a single idea by ID
export const getIdeaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }
    res.status(200).json(idea);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching idea", error: error.message });
  }
};

// Update an idea
export const updateIdea = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, category } = req.body;

  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }

    if (idea.status !== "Submitted") {
      res
        .status(400)
        .json({ message: 'Only ideas in "Submitted" status can be edited' });
      return;
    }

    idea.title = title || idea.title;
    idea.description = description || idea.description;
    idea.category = category || idea.category;
    idea.updatedAt = new Date();

    const updatedIdea = await idea.save();
    res.status(200).json({ success: true, data: updatedIdea });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating idea", error: error.message });
  }
};

// Delete an idea
export const deleteIdea = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }

    if (idea.status !== "Submitted") {
      res
        .status(400)
        .json({ message: 'Only ideas in "Submitted" status can be deleted' });
      return;
    }

    // Use deleteOne instead of remove
    await Idea.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Idea deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting idea", error: error.message });
  }
};

// Update idea status and award points if approved
export const updateIdeaStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status, suggestions, providedBy } = req.body; // providedBy should be passed in the request body
  console.log(req.body);
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }

    // Update idea status
    idea.status = status;
    idea.updatedAt = new Date();
    idea.updatedBy = providedBy; // Set the person who updated the status

    // If suggestions are provided, add them to the Feedback collection
    if (suggestions) {
      const feedback = new Feedback({
        idea: idea._id,
        providedBy: req.body.providedBy, // Assuming this is passed in the request
        feedbackType: "Actionable", // Default feedback type for suggestions
        comments: suggestions,
      });
      await feedback.save();

      // Link feedback to the idea
      idea.feedback = idea.feedback || [];
      idea.feedback.push(feedback._id as Schema.Types.ObjectId); // Explicitly cast feedback['_id'] to ObjectId
    }

    const updatedIdea = await idea.save();
    res.status(200).json({ success: true, data: updatedIdea });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating idea status", error: error.message });
  }
};
// Get all ideas by user
export const getIdeasByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ideas = await Idea.find({ submittedBy: req?.params?.id });
    res.status(200).json(ideas);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching ideas", error: error.message });
  }
};
export const giveReward = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rewardsPoints, comments, providedBy } = req.body; // providedBy should be passed in the request body

  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }

    if (idea.status === "Completed") {
      res.status(400).json({ message: "Idea is already completed." });
      return;
    }
    console.log(rewardsPoints, comments, providedBy);
    // Add reward and update the idea
    idea.reward = {
      points: rewardsPoints, // Single point per idea
      givenBy: providedBy,
      comment: comments,
    };
    idea.status = "Completed";
    idea.updatedAt = new Date();

    const updatedIdea = await idea.save();
    res.status(200).json({ success: true, updatedIdea });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error giving reward", error: error.message });
  }
};

export const likeIdea = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Assume userId is passed in the request body
    const ideaId = req.body.id;
    console.log(ideaId);
    const idea = await Idea.findById(ideaId);

    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }

    if (idea.likes.includes(userId)) {
      res.status(400).json({ message: "You already voted this idea" });
      return
    }

    idea.likes.push(userId);
    await idea.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Idea successfully voted",
        likes: idea.likes.length,
      });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike an idea
export const unlikeIdea = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const ideaId = req.body.id;

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }

    if (!idea.likes.includes(userId)) {
      res.status(400).json({ message: "You haven't voted this idea" });
      return;
    }

    idea.likes = idea.likes.filter((id) => id.toString() !== userId);
    await idea.save();

    res.status(200).json({
      success: true,
      message: "Your vote succesfully removed",
      likes: idea.likes.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const addComment = async (req: Request, res: Response) => {
  try {
    const { ideaId } = req.params;
    const { text, userId } = req.body; // Assume userId and comment text are passed in the request body

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
      return;
    }

    idea.comments.push({
      text,
      createdBy: userId,
      createdAt: new Date(),
    });
    await idea.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comments: idea.comments,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
export const fetchIdeasWithUserInfo = async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find()
      .populate({
        path: "submittedBy", // Path to populate (submittedBy field in Idea schema)
        select: "firstName lastName email mobile profileImage", // Fields to select from the User model
        model: "User", // Ensure you're populating with the 'User' model
      })
      .populate({
        path: "comments.createdBy", // Populating 'createdBy' in comments with user info
        select: "firstName lastName email mobile profileImage", // Only selecting the fields you need
        model: "User", // Reference to the User model
      })
      .sort({ updatedAt: -1 })
      .select(
        "title description category status createdAt submittedBy files likes comments"
      ) // Fields to select from Idea
      .exec();

    // Return the response with populated data
    res.status(200).json({
      success: true,
      data: ideas,
    });
  } catch (error: any) {
    console.error("Error fetching ideas with user info:", error);
    res.status(500).json({ error: error.message });
  }
};
