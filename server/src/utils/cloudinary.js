import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resource_type = "auto") => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resource_type,
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // remove local file from temp
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = fileName.split(".")[0]; // Remove the file extension
  return publicId; // Return only the public ID
};

const deleteOnCloudinary = async (filePath, resource_type = "image") => {
  try {
    if (!filePath) return null;

    // Extract public ID
    const publicId = extractPublicId(filePath);

    // Delete from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type,
    });

    return response;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
