import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAccessAndRefreshToken = async (_id) => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const register = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, gender } = req.body;

  if ([username, fullName, email, password, gender].some(field => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, "User with username or email already exists");
  }

  const avatarLocalPath = req.file?.path;

  let avatarUpload;
  try {
    avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new ApiError(500, "Failed to upload image");
  }

  const avatarSecureUrl = avatarUpload ? avatarUpload.secure_url : "";

  const newUser = await User.create({
    username,
    fullName,
    email,
    password,
    gender,
    avatar: avatarSecureUrl,
  });

  // Generate tokens after successful registration
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  const loggedInUser = await User.findById(newUser._id).select("-password -refreshToken");

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User registered and logged in successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200)
    .json(
      new ApiResponse(200, user, "User Profile fetched successfully")
    )
})

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError(400, "Refresh token not found");
  }

  await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError(403, "Refresh token not found");
  }

  try {
    const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ _id, refreshToken });
    if (!user) {
      throw new ApiError(403, "Token is invalid or expired");
    }

    const newAccessToken = await user.generateAccessToken();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 15 * 60 * 1000 
    });

    res.status(200).json(new ApiResponse(200, {}, "Access token refreshed"));
  } catch {
    throw new ApiError(403, "Invalid or expired refresh token");
  }
});

const getOtherUsers = asyncHandler(async (req, res) => {
  const otherUsers = await User.find({ _id: { $ne: req.user._id } });

  res.status(200).json(
    new ApiResponse(200, otherUsers, "all others users fetched")
  )
})

export {
  register,
  login,
  getProfile,
  logout,
  refreshAccessToken,
  getOtherUsers
};
