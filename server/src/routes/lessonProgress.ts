import { Router } from "express";
import { createLessonProgress, deleteLessonProgress, getLessonProgressById, getLessonProgresses, updateLessonProgress, updateLessonProgressByLessonId } from "../controllers/lessonProgress.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getLessonProgresses);
router.get("/:id", getLessonProgressById);
router.post("/", verifyAccessToken, createLessonProgress);
router.put("/lesson-progress/:lessonId", verifyAccessToken, updateLessonProgressByLessonId);
router.put("/:id", verifyAccessToken, updateLessonProgress);
router.delete("/:id", verifyAccessToken, deleteLessonProgress);

export default router;