import dotenv from "dotenv";

dotenv.config();
import app from "./app.js";
import connect_db from "./utils/db.js";

connect_db();

app.listen(process.env.PORT, () => console.log("listening at port 8080")
)