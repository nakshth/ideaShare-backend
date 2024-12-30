import { Request, Response } from "express";
import File, { IFile } from "../models/fileModel";
import path from "path";

// Upload File Handler
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Save file details to MongoDB
    const newFile: IFile = new File({
      filename: file.originalname,
      filepath: file.path,
      contentType: file.mimetype,
    });

    const savedFile = await newFile.save();

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${path.basename(file.path)}`;

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        ...savedFile.toObject(),
        url: fileUrl, // Add the URL to the response
      },
    });
  } catch (err: any) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
};

// Get File by ID
export const getFileById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.params.name);
    const file = await File.findById(req.params.name);

    if (!file) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    // Send the file to the client
    res.set("Content-Type", file.contentType);
    res.sendFile(path.resolve(file.filepath));
  } catch (err: any) {
    console.error("Download Error:", err.message);
    res
      .status(500)
      .json({ message: "File retrieval failed", error: err.message });
  }
};

export const getFileByUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filename = req.params.filename; // Extract the filename from the URL parameter
    console.log("filenamefilenamefilename",filename)
    // Find the file in the database by filename
    const file = await File.findOne({ filename: filename });

    if (!file) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    // Send the file to the client
    res.set("Content-Type", file.contentType);
    res.sendFile(path.resolve(file.filepath)); // Send the file using the stored filepath in DB
  } catch (err: any) {
    console.error("Download Error:", err.message);
    res
      .status(500)
      .json({ message: "File retrieval failed", error: err.message });
  }
};
