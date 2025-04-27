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
exports.deleteHistory = exports.updateHistory = exports.createHistory = exports.getHistoryById = exports.getHistories = void 0;
const History_1 = __importDefault(require("../models/History"));
const getHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield History_1.default.find();
    res.status(200).json({
        success: histories ? true : false,
        rs: histories ? histories : 'Histories not found'
    });
});
exports.getHistories = getHistories;
const getHistoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing history id');
    const history = yield History_1.default.findById(id);
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    });
});
exports.getHistoryById = getHistoryById;
const createHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, lessonId, exerciseId, attempts, lastAttemptAt } = req.body;
    if (!userId || !lessonId || !exerciseId || !attempts || !lastAttemptAt) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const history = yield History_1.default.create(req.body);
    yield history.save();
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    });
});
exports.createHistory = createHistory;
const updateHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId, lessonId, exerciseId, attempts, lastAttemptAt } = req.body;
    if (!id)
        throw new Error('Missing history id');
    if (!userId || !lessonId || !exerciseId || !attempts || !lastAttemptAt) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const history = yield History_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    });
});
exports.updateHistory = updateHistory;
const deleteHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing history id');
    const history = yield History_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    });
});
exports.deleteHistory = deleteHistory;
