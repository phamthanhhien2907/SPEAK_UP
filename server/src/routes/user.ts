import { Router } from "express";
import multer from 'multer'
import { createUser, getCurrent, getUser, getUsers, logout } from "../controllers/user.controller";

import { verifyAccessToken } from "../middlewares/verifyToken";
const router = Router();
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get("/current", verifyAccessToken, getCurrent);
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/logout", logout);
router.post("/", upload.fields([
    { name: 'image', maxCount: 1 },
]), verifyAccessToken, createUser);


export default router;