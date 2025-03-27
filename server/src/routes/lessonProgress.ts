import { Router } from "express";
import { createLessonProgress, deleteLessonProgress, getLessonProgressById, getLessonProgresses, updateLessonProgress } from "../controllers/LessonProgress.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getLessonProgresses);
router.get("/:id", getLessonProgressById);
router.post("/", verifyAccessToken, createLessonProgress);
router.put("/:id", verifyAccessToken, updateLessonProgress);
router.delete("/:id", verifyAccessToken, deleteLessonProgress);

export default router;