import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {FRONTEND_URL} from "../../constants.js";

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:`${FRONTEND_URL}`,
    credentials: true

}))
app.use("/api/auth",authRouter)


export default app;