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
exports.deleteLessonProgress = exports.updateLessonProgress = exports.createLessonProgress = exports.getLessonProgressById = exports.getLessonProgresses = void 0;
const LessonProgress_1 = __importDefault(require("../models/LessonProgress"));
const getLessonProgresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lessonProgress = yield LessonProgress_1.default.find();
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    });
});
exports.getLessonProgresses = getLessonProgresses;
const getLessonProgressById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing lessonProgress id');
    const lessonProgress = yield LessonProgress_1.default.findById(id);
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    });
});
exports.getLessonProgressById = getLessonProgressById;
const createLessonProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId, userId, score } = req.body;
    if (!lessonId || !userId || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const lessonProgress = yield LessonProgress_1.default.create(req.body);
    yield lessonProgress.save();
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    });
});
exports.createLessonProgress = createLessonProgress;
const updateLessonProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { lessonId, userId, score } = req.body;
    if (!id)
        throw new Error('Missing lessonProgress id');
    if (!lessonId || !userId || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const lessonProgress = yield LessonProgress_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    });
});
exports.updateLessonProgress = updateLessonProgress;
const deleteLessonProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing lessonProgress id');
    const lessonProgress = yield LessonProgress_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    });
});
exports.deleteLessonProgress = deleteLessonProgress;
