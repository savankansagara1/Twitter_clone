import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import ImageKit from 'imagekit';

dotenv.config();

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey:process.env.IMGKEIT_PRIVATE_KEY!,
  urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT!,
})

export { imagekit };
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