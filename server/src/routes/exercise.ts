import { Router } from "express";
import { getExerciseById, createExercise, deleteExercise, getExercises, updateExercise } from "../controllers/exercise.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getExercises);
router.get("/:id", getExerciseById);
router.post("/", verifyAccessToken, createExercise);
router.put("/:id", verifyAccessToken, updateExercise);
router.delete("/:id", verifyAccessToken, deleteExercise);

export default router;