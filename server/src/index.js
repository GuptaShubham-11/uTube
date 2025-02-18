import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("UNEXPECTED ERROR:", error);
      process.exit(1);
    });

    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error(`❌ MongoDB connection error: ${error}`);
    process.exit(1);
  });
