
import { Request, Response } from "express"
import Lesson from "../models/Lesson";
import PronunciationScore from "../models/PronunciationScore";

export const getPronunciationScores = async (req: Request, res: Response): Promise<void> => {
    const pronunciationScores = await Lesson.find()
    res.status(200).json({
        success: pronunciationScores ? true : false,
        rs: pronunciationScores ? pronunciationScores : 'PronunciationScores not found'
    })
}
export const getPronunciationScoreById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing pronunciationScore id')
    const pronunciationScore = await PronunciationScore.findById(id)
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    })
}

export const createPronunciationScore = async (req: Request, res: Response): Promise<void> => {
    const { userId, exerciseId, phonetic, userAudioUrl, score } = req.body
    if (!userId || !exerciseId || !phonetic || !userAudioUrl || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const pronunciationScore = await PronunciationScore.create(req.body)
    await pronunciationScore.save()
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    })
}
export const updatePronunciationScore = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { userId, exerciseId, phonetic, userAudioUrl, score } = req.body
    if (!id) throw new Error('Missing pronunciationScore id')
    if (!userId || !exerciseId || !phonetic || !userAudioUrl || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const pronunciationScore = await PronunciationScore.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    })
}
export const deletePronunciationScore = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing pronunciationScore id')
    const pronunciationScore = await PronunciationScore.findByIdAndDelete(id)
    res.status(200).json({
        success: pronunciationScore ? true : false,
        rs: pronunciationScore ? pronunciationScore : 'PronunciationScore not found'
    })
}