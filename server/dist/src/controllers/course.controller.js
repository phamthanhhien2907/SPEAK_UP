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
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Course_1.default.find();
    res.status(200).json({
        success: courses ? true : false,
        rs: courses ? courses : 'Courses not found'
    });
});
exports.getCourses = getCourses;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing course id');
    const course = yield Course_1.default.findById(id);
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    });
});
exports.getCourseById = getCourseById;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, level, thumbnail } = req.body;
    console.log(title, description, level, thumbnail);
    if (!title || !level || !thumbnail) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const course = yield Course_1.default.create(req.body);
    yield course.save();
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    });
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, level, thumbnail } = req.body;
    if (!id)
        throw new Error('Missing course id');
    if (!title || !level || !thumbnail) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const course = yield Course_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    });
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing course id');
    const course = yield Course_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    });
});
exports.deleteCourse = deleteCourse;
