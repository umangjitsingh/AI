import mongoose from "mongoose";

const connect_db = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URL);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1)
    }
};

export default connect_db;