import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already exists"],
        required: true,
    },
    email: {
        type: String,
        unique: [true, "Account already exists"],
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
},{ timestamps: true });

const userModel=mongoose.model("User",userSchema);

export default userModel