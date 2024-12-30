import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  idea: Schema.Types.ObjectId; // Reference to the Idea
  providedBy: Schema.Types.ObjectId; // Reference to the employee or manager providing feedback
  feedbackType: "Actionable" | "General"; // Type of feedback
  comments: string; // Feedback comments
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema: Schema = new mongoose.Schema({
  idea: { type: Schema.Types.ObjectId, ref: "Idea", required: true }, // Link to Idea
  providedBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true }, // Link to Employee or Innovation Manager
  feedbackType: {
    type: String,
    enum: ["Actionable", "General"],
    default: "General", // Default feedback type
  },
  comments: { type: String, required: true }, // Feedback content
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFeedback>("Feedback", feedbackSchema);
