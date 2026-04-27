import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export { cloudinary };
// // Function to upload image to Cloudinary
// export const uploadImage = async (filePath: string): Promise<string> => {
//   // TODO: Implement upload logic
//    const result = await cloudinary.uploader.upload(filePath, {
//     folder: 'TWITTER_CLONE', // optional: specify a folder in Cloudinary
//   });

//   return result.secure_url;
// };

// // Function to delete image from Cloudinary
// export const deleteImage = async (publicId: string): Promise<void> => {
//   // TODO: Implement delete logic
// };