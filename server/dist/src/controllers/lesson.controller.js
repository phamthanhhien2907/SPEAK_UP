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
exports.deleteLesson = exports.updateLesson = exports.createLesson = exports.getLessonById = exports.getLessons = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const getLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lessons = yield Lesson_1.default.find();
    res.status(200).json({
        success: lessons ? true : false,
        rs: lessons ? lessons : 'Lessons not found'
    });
});
exports.getLessons = getLessons;
const getLessonById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing lesson id');
    const lesson = yield Lesson_1.default.findById(id);
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    });
});
exports.getLessonById = getLessonById;
const createLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, title, content, type } = req.body;
    if (!courseId || !title || !type) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const lesson = yield Lesson_1.default.create(req.body);
    yield lesson.save();
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    });
});
exports.createLesson = createLesson;
const updateLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { courseId, title, content, type } = req.body;
    if (!id)
        throw new Error('Missing lesson id');
    if (!courseId || !title || !type) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const lesson = yield Lesson_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    });
});
exports.updateLesson = updateLesson;
const deleteLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing lesson id');
    const lesson = yield Lesson_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    });
});
exports.deleteLesson = deleteLesson;
