import mongoose, { Schema, Document } from 'mongoose';

// Define File Interface for TypeScript
export interface IFile extends Document {
  filename: string;
  filepath: string;
  contentType: string;
  uploadDate: Date;
}

// Define File Schema
const FileSchema: Schema<IFile> = new Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  contentType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

// Export File Model
export default mongoose.model<IFile>('File', FileSchema);
