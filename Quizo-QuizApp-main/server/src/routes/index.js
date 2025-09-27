import express from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import quizRoutes from "./quiz.routes.js";
import scoreRoutes from "./score.routes.js"; // ✅ keep ONLY this one
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/quiz", quizRoutes);
router.use("/score", scoreRoutes); // ✅ correct
router.use("/admin", adminRoutes);

export default router;
