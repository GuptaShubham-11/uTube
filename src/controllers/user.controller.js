import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinry } from "../utils/cloudinry.js"


const registerUser = asyncHandler( async (req, res) => {

    // Get user data from frontend
    const { username, email, fullname, password } = req.body;

    // Validation for data
    if (
        [ username, email, fullname, password].some((field) => (field?.trim() === ""))
    ) {
        throw new ApiError(400, "All fields are required!!!");    
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already existed.");
    }
    
    // Get images local path from multer
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; Because it give us to undifine error

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Now upload the local images to coludinry platform
    const avatar = await uploadOnCloudinry(avatarLocalPath);
    const coverImage = await uploadOnCloudinry(coverImageLocalPath);
    
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Data store in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // check User created successfully or not
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "User not register properly!!!");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    );

});

export { registerUser };