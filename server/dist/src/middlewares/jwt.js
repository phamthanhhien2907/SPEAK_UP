"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (uid, role) => jsonwebtoken_1.default.sign({ _id: uid, role: role }, process.env.JWT_SECRET, { expiresIn: '2d' });
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (uid) => jsonwebtoken_1.default.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '7d' });
exports.generateRefreshToken = generateRefreshToken;
