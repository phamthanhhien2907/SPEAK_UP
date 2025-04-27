
import { Request, Response } from "express"
import History from "../models/History"

export const getHistories = async (req: Request, res: Response): Promise<void> => {
    const histories = await History.find().populate({
        path: "lessonId",
        select: "courseId title content type",
    })
        .populate({
            path: "exerciseId",
            select: "lessonId type prompt difficultyLevel correctPronunciation",
        })
        .populate({
            path: "userId",
            select: "firstname lastname email",
        });
    res.status(200).json({
        success: histories ? true : false,
        rs: histories ? histories : 'Histories not found'
    })
}
export const getHistoryById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing history id')
    const history = await History.findById(id)
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    })
}

export const createHistory = async (req: Request, res: Response): Promise<void> => {
    const { userId, lessonId, exerciseId, attempts, lastAttemptAt } = req.body
    if (!userId || !lessonId || !exerciseId || !attempts || !lastAttemptAt) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const history = await History.create(req.body)
    await history.save()
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    })
}
export const updateHistory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { userId, lessonId, exerciseId, attempts, lastAttemptAt } = req.body
    if (!id) throw new Error('Missing history id')
    if (!userId || !lessonId || !exerciseId || !attempts || !lastAttemptAt) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const history = await History.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    })
}
export const deleteHistory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing history id')
    const history = await History.findByIdAndDelete(id)
    res.status(200).json({
        success: history ? true : false,
        rs: history ? history : 'History not found'
    })
}