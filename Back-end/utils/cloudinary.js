import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
cloudinary.api
  .ping()
  .then(() => console.log("Cloudinary connection successful!"))
  .catch((err) => console.error("Cloudinary connection error:", err));
