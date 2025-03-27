import { Router } from "express";
import { createProgressTracking, deleteProgressTracking, getProgressTrackingById, getProgressTrackings, updateProgressTracking } from "../controllers/progressTracking.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getProgressTrackings);
router.get("/:id", getProgressTrackingById);
router.post("/", verifyAccessToken, createProgressTracking);
router.put("/:id", verifyAccessToken, updateProgressTracking);
router.delete("/:id", verifyAccessToken, deleteProgressTracking);

export default router;