import { Router } from "express";
import { getLessonById, getLessons, createLesson, deleteLesson, updateLesson } from "../controllers/lesson.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getLessons);
router.get("/:id", getLessonById);
router.post("/", verifyAccessToken, createLesson);
router.put("/:id", verifyAccessToken, updateLesson);
router.delete("/:id", verifyAccessToken, deleteLesson);

export default router;