import { Router } from "express";
import { removeFromWishlist, getWishlist, addToWishlist } from "../controllers/wishlist.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();

router.post("/add", verifyAccessToken, addToWishlist);

router.delete("/remove/:lessonId", verifyAccessToken, removeFromWishlist);

router.get("/", verifyAccessToken, getWishlist);
export default router;
