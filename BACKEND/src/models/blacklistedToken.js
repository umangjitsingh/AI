import mongoose from "mongoose";

const blacklistedTokenSchema=mongoose.Schema({
    token:{
        type:String,
        required:[true,"token must be added in blacklist"]
    }
},{timestamps:true});

const blacklistedTokenModel=mongoose.model("BlacklistedToken",blacklistedTokenSchema);
export default blacklistedTokenModel;