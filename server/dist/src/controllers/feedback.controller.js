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
exports.deleteFeedback = exports.updateFeedback = exports.createFeedback = exports.getFeedbackById = exports.getFeedbacks = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbacks = yield Feedback_1.default.find();
    res.status(200).json({
        success: feedbacks ? true : false,
        rs: feedbacks ? feedbacks : 'Feedbacks not found'
    });
});
exports.getFeedbacks = getFeedbacks;
const getFeedbackById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing feedback id');
    const feedback = yield Feedback_1.default.findById(id);
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    });
});
exports.getFeedbackById = getFeedbackById;
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, lessonId, comment, rating } = req.body;
    if (!userId || !lessonId || !comment || !rating) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const feedback = yield Feedback_1.default.create(req.body);
    yield feedback.save();
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    });
});
exports.createFeedback = createFeedback;
const updateFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId, lessonId, comment, rating } = req.body;
    if (!id)
        throw new Error('Missing feedback id');
    if (!userId || !lessonId || !comment || !rating) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const feedback = yield Feedback_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    });
});
exports.updateFeedback = updateFeedback;
const deleteFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing feedback id');
    const feedback = yield Feedback_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    });
});
exports.deleteFeedback = deleteFeedback;
