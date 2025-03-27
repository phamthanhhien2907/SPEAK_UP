
import { Request, Response } from "express"
import Exercise from "../models/Exercise"

export const getExercises = async (req: Request, res: Response): Promise<void> => {
    const exercises = await Exercise.find()
    res.status(200).json({
        success: exercises ? true : false,
        rs: exercises ? exercises : 'Exercises not found'
    })
}
export const getExerciseById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing exercise id')
    const exercises = await Exercise.findById(id)
    res.status(200).json({
        success: exercises ? true : false,
        rs: exercises ? exercises : 'Exercise not found'
    })
}

export const createExercise = async (req: Request, res: Response): Promise<void> => {
    const { lessonId, type, prompt, correctPronunciation, difficultyLevel } = req.body

    if (!lessonId || !type || !prompt || !correctPronunciation || !difficultyLevel) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }

    const exercise = await Exercise.create(req.body)
    await exercise.save()
    res.status(200).json({
        success: exercise ? true : false,
        rs: exercise ? exercise : 'Exercise not found'
    })
}
export const updateExercise = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { lessonId, type, prompt, correctPronunciation, difficultyLevel } = req.body
    if (!id) throw new Error('Missing exercise id')
    if (!lessonId || !type || !prompt || !correctPronunciation || !difficultyLevel) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const exercise = await Exercise.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: exercise ? true : false,
        rs: exercise ? exercise : 'Exercise not found'
    })
}
export const deleteExercise = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing exercise id')
    const exercise = await Exercise.findByIdAndDelete(id)
    res.status(200).json({
        success: exercise ? true : false,
        rs: exercise ? exercise : 'Exercise not found'
    })
}