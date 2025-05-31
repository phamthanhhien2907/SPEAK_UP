
import { Request, Response } from "express"
import Vocabulary from "../models/Vocabulary";

export const getVocabularies = async (req: Request, res: Response): Promise<void> => {
    const vocabularies = await Vocabulary.find().populate({
        path: "lessonId",
        select: "title content type courseId",
    });
    res.status(200).json({
        success: vocabularies ? true : false,
        rs: vocabularies ? vocabularies : 'Vocabularies not found'
    })
}
export const getVocabularyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing vocabulary id')
    const vocabulary = await Vocabulary.findById(id)
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    })
}
export const createVocabulary = async (req: Request, res: Response): Promise<void> => {
    const { word, phonetic, meaning, exampleSentence, audioUrl } = req.body
    if (!word || !phonetic || !exampleSentence || !meaning || !audioUrl) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const vocabulary = await Vocabulary.create(req.body)
    await vocabulary.save()
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    })
}
export const updateVocabulary = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { word, phonetic, meaning, exampleSentence, audioUrl } = req.body
    if (!id) throw new Error('Missing vocabulary id')
    if (!word || !phonetic || !exampleSentence || !meaning || !audioUrl) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const vocabulary = await Vocabulary.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    })
}
export const deleteVocabulary = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing vocabulary id')
    const vocabulary = await Vocabulary.findByIdAndDelete(id)
    res.status(200).json({
        success: vocabulary ? true : false,
        rs: vocabulary ? vocabulary : 'Vocabulary not found'
    })
}
export const getVocabularyByLessonId = async (req: Request, res: Response): Promise<void> => {
    try {
        const lessonId = req.params.lessonId;
        const vocabularies = await Vocabulary.find({ lessonId: lessonId }).exec();
        if (!vocabularies || vocabularies.length === 0) {
            res.status(404).json({ message: 'No vocabulary found for this lesson' });
            return
        }
        res.json(vocabularies);
    } catch (error) {
        console.error('Error fetching vocabulary:', error);
        res.status(500).json({ message: 'Server error' });
    }
}