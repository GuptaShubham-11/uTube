import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // remove local file from temp
    fs.unlinkSync(localFilePath);
    console.log(error);
    return null;
  }
};

const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = fileName.split(".")[0]; // Remove the file extension
  return publicId; // Return only the public ID
};

const deleteOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // Extract public ID
    const publicId = extractPublicId(filePath);

    // Delete from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
