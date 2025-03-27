import { Router } from "express";
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from "../controllers/course.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", verifyAccessToken, createCourse);
router.put("/:id", verifyAccessToken, updateCourse);
router.delete("/:id", verifyAccessToken, deleteCourse);

export default router;