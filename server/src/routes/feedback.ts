import { Router } from "express";
import { createFeedback, deleteFeedback, getFeedbackById, getFeedbacks, updateFeedback } from "../controllers/feedback.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getFeedbacks);
router.get("/:id", getFeedbackById);
router.post("/", verifyAccessToken, createFeedback);
router.put("/:id", verifyAccessToken, updateFeedback);
router.delete("/:id", verifyAccessToken, deleteFeedback);

export default router;