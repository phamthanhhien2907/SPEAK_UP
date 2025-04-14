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
exports.deletePronunciationScore = exports.updatePronunciationScore = exports.createPronunciationScore = exports.getPronunciationScoreById = exports.getPronunciationScores = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const PronunciationScore_1 = __importDefault(require("../models/PronunciationScore"));
const getPronunciationScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pronunciationScores = yield Lesson_1.default.find();
    res.status(200).json({
        success: pronunciationScores ? true : false,
        rs: pronunciationScores ? pronunciationScores : 'PronunciationScores not found'
    });
});
exports.getPronunciationScores = getPronunciationScores;
const getPronunciationScoreById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing pronunciationScore id');
    const pronunciationScore = yield PronunciationScore_1.default.findById(id);
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    });
});
exports.getPronunciationScoreById = getPronunciationScoreById;
const createPronunciationScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, exerciseId, phonetic, userAudioUrl, score } = req.body;
    if (!userId || !exerciseId || !phonetic || !userAudioUrl || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const pronunciationScore = yield PronunciationScore_1.default.create(req.body);
    yield pronunciationScore.save();
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    });
});
exports.createPronunciationScore = createPronunciationScore;
const updatePronunciationScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId, exerciseId, phonetic, userAudioUrl, score } = req.body;
    if (!id)
        throw new Error('Missing pronunciationScore id');
    if (!userId || !exerciseId || !phonetic || !userAudioUrl || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const pronunciationScore = yield PronunciationScore_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    });
});
exports.updatePronunciationScore = updatePronunciationScore;
const deletePronunciationScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing pronunciationScore id');
    const pronunciationScore = yield PronunciationScore_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    });
});
exports.deletePronunciationScore = deletePronunciationScore;
