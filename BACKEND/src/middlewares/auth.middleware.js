import {verifyToken} from "../utils/jwt.js";
import userModel from "../models/user.model.js";
import blacklistedTokenModel from "../models/blacklistedToken.js";

const authM = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        const isBlackListed=await blacklistedTokenModel.findOne({token:token});
        if(isBlackListed){
            return res.status(400).json({
                message: "Invalid token/ blacklisted."
            })
        }
        const userData = verifyToken(token)
        req.user = await userModel.findById({_id:userData.id}).select("-password");
        next()
    } catch (e) {
        return res.status(401).json({
            message: `Invalid token.${e}`
        })
    }
}
export default authM;