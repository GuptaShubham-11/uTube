import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) return null;

    const fileStream = fs.createReadStream(localFilePath);
    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      throw new Error("Failed to read the file stream.");
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          chunk_size: 10 * 1024 * 1024, // 10MB chunk size
          timeout: 60000, // 1 minute timeout
          folder: "uTube",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload failed:", error);
            reject(new Error("Cloudinary upload failed"));
          } else {
            if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // Delay this until upload success
            resolve(result);
          }
        },
      );

      fileStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop();
  return fileName.split(".")[0];
};

const deleteOnCloudinary = async (filePath, resourceType = "auto") => {
  try {
    if (!filePath) return null;
    const publicId = extractPublicId(filePath);
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return response;
  } catch (error) {
    console.error("Deletion failed:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
