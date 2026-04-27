import { Request, Response } from "express";
// import { cloudinary } from "../config/cloudinary";
import { cloudinary } from "../config/cloudinary"
// Controller for media upload operations

// Function to upload media
export const uploadMedia = async (req: Request, res: Response) => {
  // TODO: Implement media upload to Cloudinary
  try {
    const file = req.file;
    console.log(file);
  

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error: any, result: any) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res
            .status(500)
            .json({ message: "Media upload failed",  error: (error as any)?.message || error });
        }
        res
          .status(200)
          .json({
            message: "Media uploaded successfully",
            url: result.secure_url,
          });
      },
    );
    result.end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Media upload failed", error });
  }
};
