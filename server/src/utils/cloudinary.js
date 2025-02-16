import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) return null;
    const fileStream = fs.createReadStream(localFilePath);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, chunk_size: 100 * 1024 * 1024, timeout: 60000 },
        (error, result) => {
          if (error) {
            reject(new Error('Cloudinary upload failed'));
          } else {
            if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // Delete local file after upload
            resolve(result);
          }
        }
      );

      fileStream.pipe(uploadStream);
    });
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop();
  return fileName.split(".")[0]; // Return only the public ID
};

const deleteOnCloudinary = async (filePath, resourceType = "auto") => {
  try {
    if (!filePath) return null;
    const publicId = extractPublicId(filePath);
    const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
