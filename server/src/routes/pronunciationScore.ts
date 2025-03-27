import { Router } from "express";
import { createPronunciationScore, deletePronunciationScore, getPronunciationScoreById, getPronunciationScores, updatePronunciationScore } from "../controllers/pronunciationScore.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getPronunciationScores);
router.get("/:id", getPronunciationScoreById);
router.post("/", verifyAccessToken, createPronunciationScore);
router.put("/:id", verifyAccessToken, updatePronunciationScore);
router.delete("/:id", verifyAccessToken, deletePronunciationScore);

export default router;