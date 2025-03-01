import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware function to verify JWT
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Step 1: Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken || // From cookies
      req.header("Authorization")?.replace("Bearer ", ""); // From Authorization header

    // Step 2: If no token, throw error
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Step 3: Verify the token using jwt.verify
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Step 4: Look up the user in the database using the decoded token's _id
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken" // Exclude password and refreshToken from the result
    );

    // Step 5: If user not found, throw error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token!");
    }

    // Step 6: Attach user to the request object for later use in route handlers
    req.user = user;

    // Step 7: Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Step 8: Handle any errors that occur during verification
    throw new ApiError(401, error?.message || "Invalid Access Token!");
  }
});
