import express from "express";
import {getMe, loginController, logoutController, registerController} from "../controllers/auth.controller.js";
import authM from "../middlewares/auth.middleware.js";

const authRouter=express.Router();

authRouter.post("/register",registerController);
authRouter.post("/login",loginController);
authRouter.get("/logout",logoutController);
authRouter.get("/get-me",authM,getMe);


export default authRouter;