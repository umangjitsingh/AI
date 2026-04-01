import { verifyToken } from "../utils/jwt.js";
import userModel from "../models/user.model.js";
import blacklistedTokenModel from "../models/blacklistedToken.js";

const authM = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // 1. No token at all
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // 2. Check blacklist
        const isBlackListed = await blacklistedTokenModel.findOne({ token });
        if (isBlackListed) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        // 3. Verify token
        const userData = verifyToken(token);

        // 4. Load user
        const user = await userModel.findById(userData.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (e) {
        return res.status(401).json({
            message: "Invalid token",
            error: e.message
        });
    }
};

export default authM;