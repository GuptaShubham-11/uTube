import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinry } from "../utils/cloudinry.js";
import jwt from "jsonwebtoken";


const genrateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.genrateAccessToken();
        const refreshToken = user.genrateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Srever error because access and refresh tokens are not genrated properly");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // Get user data from frontend
    const { username, email, fullname, password } = req.body;

    // Validation for data
    if (
        [username, email, fullname, password].some((field) => (field?.trim() === ""))
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

const loginUser = asyncHandler(async (req, res) => {
    // Take data from req
    const { username, email, password } = req.body;

    console.log(username, email);

    // Validation on email || username is required
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Check in database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    // Not exist
    if (!user) {
        throw new ApiError(409, "User does not exist!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password does not correct!");
    }

    const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password, -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged In successfully"
            )
        )
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully."
            )
        )

});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
        if (incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request!");
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token!");
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or use!");        
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, newRefreshToken} = await genrateAccessAndRefreshTokens(user?._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToke", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
        
    }

});

export { registerUser, loginUser, logoutUser, refreshAccessToken };