"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                mes: 'Invalid access token',
            });
            return;
        }
    }
    else {
        res.status(401).json({
            success: false,
            mes: 'Require authentication!!!'
        });
        return;
    }
});
exports.verifyAccessToken = verifyAccessToken;
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            mes: "REQUIRE ADMIN ROLE",
        });
    }
    next();
};
exports.isAdmin = isAdmin;
