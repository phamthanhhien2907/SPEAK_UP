import { Router } from "express";
import { getEnrollmentById, createEnrollment, deleteEnrollment, getEnrollments, updateEnrollment } from "../controllers/enrollment.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getEnrollments);
router.get("/:id", getEnrollmentById);
router.post("/", verifyAccessToken, createEnrollment);
router.put("/:id", verifyAccessToken, updateEnrollment);
router.delete("/:id", verifyAccessToken, deleteEnrollment);

export default router;