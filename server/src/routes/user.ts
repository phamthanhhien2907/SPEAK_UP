import { Router } from "express";
import multer from 'multer'
import { createUser, getCurrent, login, logout, register } from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/register", register);
router.post("/login", login);
router.get("/current", verifyAccessToken, getCurrent);
router.get("/logout", logout);
router.post("/", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
]), verifyAccessToken, createUser);



export default router;