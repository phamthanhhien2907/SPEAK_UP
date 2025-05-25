import { Router } from "express";
import { getLessonById, getLessons, createLesson, deleteLesson, updateLesson, getParentLessons, getLessonsByParent, getLessonByParentTopicId } from "../controllers/lesson.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getLessons);
router.get("/getParentLesson", verifyAccessToken, getParentLessons);
router.get("/getLessonByParent/:parentLessonId", verifyAccessToken, getLessonsByParent);
router.get("/getLessonByParentTopicId/:parentTopicId", verifyAccessToken, getLessonByParentTopicId);
router.get("/:id", getLessonById);
router.post("/", verifyAccessToken, createLesson);
router.put("/:id", verifyAccessToken, updateLesson);
router.delete("/:id", verifyAccessToken, deleteLesson);

export default router;