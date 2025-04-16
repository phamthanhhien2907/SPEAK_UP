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
exports.deleteVocabulary = exports.updateVocabulary = exports.createVocabulary = exports.getVocabularyById = exports.getVocabularies = void 0;
const Vocabulary_1 = __importDefault(require("../models/Vocabulary"));
const getVocabularies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vocabularies = yield Vocabulary_1.default.find();
    res.status(200).json({
        success: vocabularies ? true : false,
        rs: vocabularies ? vocabularies : 'Vocabularies not found'
    });
});
exports.getVocabularies = getVocabularies;
const getVocabularyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing vocabulary id');
    const vocabulary = yield Vocabulary_1.default.findById(id);
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    });
});
exports.getVocabularyById = getVocabularyById;
const createVocabulary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { word, phonetic, meaning, exampleSentence, audioUrl } = req.body;
    if (!word || !phonetic || !exampleSentence || !meaning || !audioUrl) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const vocabulary = yield Vocabulary_1.default.create(req.body);
    yield vocabulary.save();
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    });
});
exports.createVocabulary = createVocabulary;
const updateVocabulary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { word, phonetic, meaning, exampleSentence, audioUrl } = req.body;
    if (!id)
        throw new Error('Missing vocabulary id');
    if (!word || !phonetic || !exampleSentence || !meaning || !audioUrl) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        });
        return;
    }
    const vocabulary = yield Vocabulary_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    });
});
exports.updateVocabulary = updateVocabulary;
const deleteVocabulary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error('Missing vocabulary id');
    const vocabulary = yield Vocabulary_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    });
});
exports.deleteVocabulary = deleteVocabulary;
