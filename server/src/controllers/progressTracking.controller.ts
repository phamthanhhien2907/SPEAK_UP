
import { Request, Response } from "express"
import ProgressTracking from "../models/ProgressTracking"


export const getProgressTrackings = async (req: Request, res: Response): Promise<void> => {
    const progressTrackings = await ProgressTracking.find()
    res.status(200).json({
        success: progressTrackings ? true : false,
        rs: progressTrackings ? progressTrackings : 'ProgressTrackings not found'
    })
}
export const getProgressTrackingById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing lessonProgress id')
    const progressTracking = await ProgressTracking.findById(id)
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    })
}
export const createProgressTracking = async (req: Request, res: Response): Promise<void> => {
    const { userId, completedLessons, totalScore } = req.body
    if (!userId || !completedLessons || !totalScore) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const progressTracking = await ProgressTracking.create(req.body)
    await progressTracking.save()
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    })
}
export const updateProgressTracking = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { userId, completedLessons, totalScore } = req.body
    if (!id) throw new Error('Missing lessonProgress id')
    if (!userId || !completedLessons || !totalScore) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const progressTracking = await ProgressTracking.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    })
}
export const deleteProgressTracking = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing progressTracking id')
    const progressTracking = await ProgressTracking.findByIdAndDelete(id)
    res.status(200).json({
        success: progressTracking ? true : false,
        rs: progressTracking ? progressTracking : 'ProgressTracking not found'
    })
}