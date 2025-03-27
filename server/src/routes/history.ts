import { Router } from "express";
import { createHistory, deleteHistory, getHistories, getHistoryById, updateHistory } from "../controllers/history.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.get("/", getHistories);
router.get("/:id", getHistoryById);
router.post("/", verifyAccessToken, createHistory);
router.put("/:id", verifyAccessToken, updateHistory);
router.delete("/:id", verifyAccessToken, deleteHistory);

export default router;