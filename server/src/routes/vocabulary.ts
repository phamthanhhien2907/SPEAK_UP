import { Router } from "express";
import { createVocabulary, deleteVocabulary, getVocabularies, getVocabularyById, updateVocabulary } from "../controllers/vocabulary.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getVocabularies);
router.get("/:id", getVocabularyById);
router.post("/", verifyAccessToken, createVocabulary);
router.put("/:id", verifyAccessToken, updateVocabulary);
router.delete("/:id", verifyAccessToken, deleteVocabulary);

export default router;