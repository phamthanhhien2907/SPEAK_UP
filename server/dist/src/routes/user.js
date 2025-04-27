"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const user_controller_1 = require("../controllers/user.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
router.get("/current", verifyToken_1.verifyAccessToken, user_controller_1.getCurrent);
router.get("/logout", user_controller_1.logout);
router.post("/", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
]), verifyToken_1.verifyAccessToken, user_controller_1.createUser);
exports.default = router;
