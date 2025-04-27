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
exports.deleteExerciseVocabulary = exports.updateExerciseVocabulary = exports.createExerciseVocabulary = exports.getExerciseVocabularyById = exports.getExerciseVocabularies = void 0;
const ExerciseVocabulary_1 = __importDefault(require("../models/ExerciseVocabulary"));
const getExerciseVocabularies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exerciseVocabulary = yield ExerciseVocabulary_1.default.find();
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    });
});
exports.getExerciseVocabularies = getExerciseVocabularies;
const getExerciseVocabularyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing exerciseVocabulary id');
    const exerciseVocabulary = yield ExerciseVocabulary_1.default.findById(id);
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    });
});
exports.getExerciseVocabularyById = getExerciseVocabularyById;
const createExerciseVocabulary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId, type, prompt, correctPronunciation, difficultyLevel } = req.body;
    if (!lessonId || !type || !prompt || !correctPronunciation || !difficultyLevel) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const exerciseVocabulary = yield ExerciseVocabulary_1.default.create(req.body);
    yield exerciseVocabulary.save();
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    });
});
exports.createExerciseVocabulary = createExerciseVocabulary;
const updateExerciseVocabulary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { lessonId, type, prompt, correctPronunciation, difficultyLevel } = req.body;
    if (!id)
        throw new Error('Missing exerciseVocabulary id');
    if (!lessonId || !type || !prompt || !correctPronunciation || !difficultyLevel) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const exerciseVocabulary = yield ExerciseVocabulary_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    });
});
exports.updateExerciseVocabulary = updateExerciseVocabulary;
const deleteExerciseVocabulary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing exerciseVocabulary id');
    const exerciseVocabulary = yield ExerciseVocabulary_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    });
});
exports.deleteExerciseVocabulary = deleteExerciseVocabulary;
