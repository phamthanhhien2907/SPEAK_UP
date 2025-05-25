import { Router } from "express";
import { createTopic, deleteTopic, getTopicById, getTopics, updateTopic } from "../controllers/topic.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", verifyAccessToken, getTopics);
router.get("/:id", verifyAccessToken, getTopicById);
router.post("/", verifyAccessToken, createTopic);
router.put("/:id", verifyAccessToken, updateTopic);
router.delete("/:id", verifyAccessToken, deleteTopic);

export default router;