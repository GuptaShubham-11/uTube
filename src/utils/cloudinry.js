import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINRY_CLOUD_NAME, 
    api_key: process.env.CLOUDINRY_API_KEY, 
    api_secret: process.env.CLOUDINRY_API_SECRET 
});

const uploadOnCloudinry = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader(localFilePath, {
            resource_type: "auto"
        });
        console.log("File is uploaded on cloudinry successfully...", response);
        return response;
    } catch (error) {
        // remove local file from temp
        fs.unlinkSync(localFilePath);
        console.log(error);
        return null;
    }
}


export { uploadOnCloudinry };