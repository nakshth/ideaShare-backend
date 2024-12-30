import mongoose, { Schema, Document } from "mongoose";

// Define the User interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  profileImage: string | null;
  email: string;
  role: string;
  mobile: string;
  password: string;
  status: "Active" | "Disabled";
}

// Define the schema
const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profileImage: { type: String, default: null,required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    profie: { type: String, required: false }, // Assuming this field is intentional
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["Active", "Disabled"], default: "Active" }, // New field
  },
  { timestamps: true }
);

// Export the model
export default mongoose.model<IUser>("User", UserSchema);
