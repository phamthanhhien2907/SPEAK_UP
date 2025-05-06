import { Router } from "express";

import { verifyAccessToken } from "../middlewares/verifyToken";
import { getRecommendations } from "../controllers/recommendation.controller";
const router = Router();
router.get("/", verifyAccessToken, getRecommendations);
export default router;