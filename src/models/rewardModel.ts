import mongoose, { Schema, Document } from "mongoose";

export interface IReward extends Document {
  userId: string;
  points: number;
  ideaId: string;
  awardedAt: Date;
}

const rewardSchema: Schema = new mongoose.Schema({
  userId: { type: String, required: true },
  points: { type: Number, required: true },
  ideaId: { type: String, required: true },
  awardedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReward>("Reward", rewardSchema);
