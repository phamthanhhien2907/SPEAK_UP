
import { Request, Response } from "express"
import ExerciseVocabulary from "../models/ExerciseVocabulary"

export const getExerciseVocabularies = async (req: Request, res: Response): Promise<void> => {
    const exerciseVocabulary = await ExerciseVocabulary.find().populate({
        path: "vocabularyId",
        select: "word phonetic meaning exampleSentence audioUrl",
    })
        .populate({
            path: "exerciseId",
            select: "lessonId type prompt difficultyLevel correctPronunciation",
        })
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    })
}
export const getExerciseVocabularyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing exerciseVocabulary id')
    const exerciseVocabulary = await ExerciseVocabulary.findById(id)
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    })
}

export const createExerciseVocabulary = async (req: Request, res: Response): Promise<void> => {
    const { exerciseId, vocabularyId } = req.body

    if (!exerciseId || !vocabularyId) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }

    const exerciseVocabulary = await ExerciseVocabulary.create(req.body)
    await exerciseVocabulary.save()
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    })
}
export const updateExerciseVocabulary = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { exerciseId, vocabularyId } = req.body
    if (!id) throw new Error('Missing exerciseVocabulary id')
    if (!exerciseId || !vocabularyId) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const exerciseVocabulary = await ExerciseVocabulary.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    })
}
export const deleteExerciseVocabulary = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing exerciseVocabulary id')
    const exerciseVocabulary = await ExerciseVocabulary.findByIdAndDelete(id)
    res.status(200).json({
        success: exerciseVocabulary ? true : false,
        rs: exerciseVocabulary ? exerciseVocabulary : 'ExerciseVocabulary not found'
    })
}