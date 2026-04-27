import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
export const uploadImage = async (filePath: string): Promise<string> => {
  // TODO: Implement upload logic
  return '';
};

// Function to delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  // TODO: Implement delete logic
};