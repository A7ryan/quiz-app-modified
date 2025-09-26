import { app } from "./src/app.js";
import connectDB from "./src/db/index.js";
import conf from "./src/conf/conf.js";

const PORT = conf.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("DB connection established");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();

