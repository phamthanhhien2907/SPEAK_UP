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
exports.deleteEnrollment = exports.updateEnrollment = exports.createEnrollment = exports.getEnrollmentById = exports.getEnrollments = void 0;
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const getEnrollments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollment = yield Enrollment_1.default.find();
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollments not found'
    });
});
exports.getEnrollments = getEnrollments;
const getEnrollmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing enrollment id');
    const enrollment = yield Enrollment_1.default.findById(id);
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    });
});
exports.getEnrollmentById = getEnrollmentById;
const createEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, userId, progress, status } = req.body;
    if (!courseId || !userId || !progress || !status) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const enrollment = yield Enrollment_1.default.create(req.body);
    yield enrollment.save();
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    });
});
exports.createEnrollment = createEnrollment;
const updateEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { courseId, userId, progress, status } = req.body;
    if (!id)
        throw new Error('Missing enrollment id');
    if (!courseId || !userId || !progress || !status) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const enrollment = yield Enrollment_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    });
});
exports.updateEnrollment = updateEnrollment;
const deleteEnrollment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing enrollment id');
    const enrollment = yield Enrollment_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    });
});
exports.deleteEnrollment = deleteEnrollment;
