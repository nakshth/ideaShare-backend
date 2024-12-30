import mongoose, { Schema, Document } from "mongoose";

export interface IIdea extends Document {
  title: string;
  feedback: Schema.Types.ObjectId[]; // Array of Feedback ObjectIds
  updatedBy: Schema.Types.ObjectId; // Reference to the person who updated the status
  description: string;
  category: string;
  submittedBy: Schema.Types.ObjectId;
  status: "Submitted" | "In Progress" | "Approved" | "Rejected" | "Completed";
  files: string[];
  createdAt: Date;
  updatedAt: Date;
  reward: {
    points: number;
    givenBy: Schema.Types.ObjectId;
    comment: string;
  } | null; // Reward details
  likes: Schema.Types.ObjectId[]; // Array of user ObjectIds who liked the idea
  comments: {
    text: string; // Comment text
    createdBy: Schema.Types.ObjectId; // Reference to the User who created the comment
    createdAt: Date; // Timestamp when the comment was created
    createdByUser?: { // Optional field for populated user data
      firstName: string;
      lastName: string;
      email: string;
      mobile: string;
      profileImage: string | null;
    };
  }[];
}

const ideaSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true }, // Link to Employee
  status: {
    type: String,
    enum: ["Submitted", "In Progress", "Approved", "Rejected", "Completed"],
    default: "Submitted",
  },
  feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }], // Feedback references
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  files: { type: [String], default: [] },
  reward: {
    points: { type: Number, default: null },
    givenBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    comment: { type: String, default: null },
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of users who liked the idea
  comments: [
    {
      text: { type: String, required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
      createdAt: { type: Date, default: Date.now },
      
    },
  ],
});

export default mongoose.model<IIdea>("Idea", ideaSchema);
