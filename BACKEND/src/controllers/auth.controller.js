import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import {generateToken} from "../utils/jwt.js";
import blacklistedTokenModel from "../models/blacklistedToken.js";

async function registerController(req, res) {
    try {
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({message: "Please provide username, email and password"});
        }

        const isUserAlreadyPresent = await userModel.findOne({
            $or: [{username}, {email}]
        });

        if (isUserAlreadyPresent) {
            return res.status(400).json({message: "User already present"});
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const user = await userModel.create({username, email, password: hashPassword});

        const token = generateToken(user._id);

        res.cookie("token", token);



        return res.status(201).json({message: "User registered successfully", user});
    } catch (e) {
        return res.status(400).json({message: `Register error: ${e}`});
    }
}

async function loginController(req, res) {
    try {
        const { option, password } = req.body;

        if (!option) {
            return res.status(400).json({ message: "Please provide username or email" });
        }

        if (!password) {
            return res.status(400).json({ message: "Please provide password" });
        }

        let username = null;
        let email = null;

        // Detect email vs username
        if (option.includes("@")) {
            email = option;
        } else {
            username = option;
        }

        // Find user by either username or email
        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.cookie("token", token);



        return res.status(200).json({ message: "Login successfully" });

    } catch (e) {
        return res.status(500).json({ message: `Login error: ${e.message}` });
    }
}

async function logoutController(req, res) {
    try {
        const token = req.cookies.token;

        await blacklistedTokenModel.create({token});


        res.cookie("token", token);



        return res.status(200).json({message: "Logged out successfully"});
    } catch (e) {
        return res.status(500).json({message: `Logout error: ${e.message}`});
    }
}

async function getMe(req, res) {
    try {
        const user = req.user;
        console.log("user",user)
        return res.status(200).json({user});

    } catch (err) {
        return res.status(400).json({
            message: `Sorry, you are not found. ${err.message}`
        })
    }
}

export {registerController, loginController, logoutController, getMe};