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
exports.deleteProgressTracking = exports.updateProgressTracking = exports.createProgressTracking = exports.getProgressTrackingById = exports.getProgressTrackings = void 0;
const ProgressTracking_1 = __importDefault(require("../models/ProgressTracking"));
const getProgressTrackings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const progressTrackings = yield ProgressTracking_1.default.find();
    res.status(200).json({
        success: progressTrackings ? true : false,
        rs: progressTrackings ? progressTrackings : 'ProgressTrackings not found'
    });
});
exports.getProgressTrackings = getProgressTrackings;
const getProgressTrackingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing lessonProgress id');
    const progressTracking = yield ProgressTracking_1.default.findById(id);
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    });
});
exports.getProgressTrackingById = getProgressTrackingById;
const createProgressTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, completedLessons, totalScore } = req.body;
    if (!userId || !completedLessons || !totalScore) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const progressTracking = yield ProgressTracking_1.default.create(req.body);
    yield progressTracking.save();
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    });
});
exports.createProgressTracking = createProgressTracking;
const updateProgressTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId, completedLessons, totalScore } = req.body;
    if (!id)
        throw new Error('Missing lessonProgress id');
    if (!userId || !completedLessons || !totalScore) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const progressTracking = yield ProgressTracking_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    });
});
exports.updateProgressTracking = updateProgressTracking;
const deleteProgressTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing progressTracking id');
    const progressTracking = yield ProgressTracking_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    });
});
exports.deleteProgressTracking = deleteProgressTracking;
