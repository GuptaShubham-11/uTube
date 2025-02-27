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

    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(localFilePath);
      fileStream.on("error", (err) => {
        console.error("File stream error:", err);
        reject(new Error("Failed to read the file stream."));
      });

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          chunk_size: 10 * 1024 * 1024, // 10MB chunk size
          timeout: 60000, // 1 min timeout
          folder: "uTube",
        },
        async (error, result) => {
          try {
            if (error) {
              console.error("Cloudinary upload failed:", error);
              reject(new Error("Cloudinary upload failed"));
            } else {
              // Delete the file **after** successful upload
              try {
                if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
              } catch (unlinkError) {
                console.error("Failed to delete local file:", unlinkError);
              }
              resolve(result);
            }
          } catch (err) {
            reject(err);
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

// Extract `public_id` from Cloudinary URL
const extractPublicId = (url) => {
  try {
    if (!url) return null;
    const parts = url.split("/");
    const filename = parts.pop();
    const versionIndex = filename.indexOf("v");
    return versionIndex !== -1 ? filename.slice(versionIndex) : filename.split(".")[0];
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};

// Delete file from Cloudinary
const deleteOnCloudinary = async (fileUrl, resourceType = "auto") => {
  try {
    if (!fileUrl) return null;
    const publicId = extractPublicId(fileUrl);
    if (!publicId) return null;

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
