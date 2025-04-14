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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.logout = exports.getCurrent = exports.login = exports.register = void 0;
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../middlewares/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!email || !password || !lastname || !firstname) {
            res.status(400).json({
                sucess: false,
                mes: 'Missing inputs'
            });
            return;
        }
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser)
            throw new Error('User has existed');
        const newUser = yield User_1.default.create(req.body);
        yield newUser.save();
        res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            sucess: false,
            mes: 'Missing inputs'
        });
        return;
    }
    // plain object
    const response = yield User_1.default.findOne({ email });
    if (response && (yield response.isCorrectPassword(password))) {
        // Tách password và role ra khỏi response
        const _a = response.toObject(), { password, role, refreshToken } = _a, userData = __rest(_a, ["password", "role", "refreshToken"]);
        // Tạo access token
        const accessToken = (0, jwt_1.generateAccessToken)(response._id, role);
        // Tạo refresh token
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(response._id);
        // Lưu refresh token vào database
        yield User_1.default.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true });
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            sucess: true,
            accessToken,
            userData
        });
    }
    else {
        throw new Error('Invalid credentials!');
    }
});
exports.login = login;
const getCurrent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const user = yield User_1.default.findById(userId).select('-refreshToken -password -role');
    res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    });
});
exports.getCurrent = getCurrent;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    console.log(cookie);
    if (!cookie || !cookie.refreshToken)
        throw new Error('No refresh token in cookies');
    yield User_1.default.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.status(200).json({
        success: true,
        mes: 'Logout is done'
    });
});
exports.logout = logout;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing' });
        return;
    }
    if (!req.files) {
        res.status(400).json({ message: 'No files uploaded' });
        return;
    }
    const files = req === null || req === void 0 ? void 0 : req.files;
    const imageFile = files['image'][0];
    // const audioFile = files['audio'][0]
    try {
        const imageResult = yield new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error)
                    reject(error);
                if (!result || !result.secure_url || !result.public_id) {
                    return reject(new Error('Cloudinary upload failed'));
                }
                resolve({
                    url: result === null || result === void 0 ? void 0 : result.secure_url,
                    id: result === null || result === void 0 ? void 0 : result.public_id,
                });
            });
            stream.end(imageFile.buffer);
        });
        // const audioResult = await new Promise(
        //     (resolve, reject) => {
        //         const stream = cloudinary.uploader.upload_stream(
        //             { resource_type: 'video' },
        //             (error, result) => {
        //                 if (error) reject(error)
        //                 resolve({
        //                     url: result?.secure_url,
        //                     id: result?.public_id,
        //                 })
        //             }
        //         )
        //         stream.end(audioFile.buffer)
        //     }
        // )
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { avatar: imageResult === null || imageResult === void 0 ? void 0 : imageResult.url }, { new: true });
        res.status(200).json({
            success: true,
            message: 'Uploaded avatar successfully',
            imageUrl: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error uploading files' });
    }
});
exports.createUser = createUser;
