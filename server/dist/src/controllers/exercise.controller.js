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
exports.deleteExercise = exports.updateExercise = exports.createExercise = exports.getExerciseById = exports.getExercises = void 0;
const Exercise_1 = __importDefault(require("../models/Exercise"));
const getExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercises = yield Exercise_1.default.find();
    res.status(200).json({
        success: exercises ? true : false,
        rs: exercises ? exercises : 'Exercises not found'
    });
});
exports.getExercises = getExercises;
const getExerciseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing exercise id');
    const exercises = yield Exercise_1.default.findById(id);
    res.status(200).json({
        success: exercises ? true : false,
        rs: exercises ? exercises : 'Exercise not found'
    });
});
exports.getExerciseById = getExerciseById;
const createExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId, type, prompt, correctPronunciation, difficultyLevel } = req.body;
    if (!lessonId || !type || !prompt || !correctPronunciation || !difficultyLevel) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const exercise = yield Exercise_1.default.create(req.body);
    yield exercise.save();
    res.status(200).json({
        success: exercise ? true : false,
        rs: exercise ? exercise : 'Exercise not found'
    });
});
exports.createExercise = createExercise;
const updateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { lessonId, type, prompt, correctPronunciation, difficultyLevel } = req.body;
    if (!id)
        throw new Error('Missing exercise id');
    if (!lessonId || !type || !prompt || !correctPronunciation || !difficultyLevel) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const exercise = yield Exercise_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: exercise ? true : false,
        rs: exercise ? exercise : 'Exercise not found'
    });
});
exports.updateExercise = updateExercise;
const deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing exercise id');
    const exercise = yield Exercise_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: exercise ? true : false,
        rs: exercise ? exercise : 'Exercise not found'
    });
});
exports.deleteExercise = deleteExercise;
