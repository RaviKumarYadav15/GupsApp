import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorised")
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized access token")
    }

})
export { verifyJWT }