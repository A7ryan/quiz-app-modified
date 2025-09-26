import express from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import quizRoutes from "./quiz.routes.js";

const router = express.Router();


router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/quiz", quizRoutes);

export default router;
