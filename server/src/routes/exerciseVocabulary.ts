import { Router } from "express";
import { getExerciseVocabularies, createExerciseVocabulary, deleteExerciseVocabulary, getExerciseVocabularyById, updateExerciseVocabulary } from "../controllers/exerciseVocabulary.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getExerciseVocabularies);
router.get("/:id", getExerciseVocabularyById);
router.post("/", verifyAccessToken, createExerciseVocabulary);
router.put("/:id", verifyAccessToken, updateExerciseVocabulary);
router.delete("/:id", verifyAccessToken, deleteExerciseVocabulary);

export default router;