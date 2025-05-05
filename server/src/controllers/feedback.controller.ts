
import { Request, Response } from "express"
import Feedback from "../models/Feedback"

export const getFeedbacks = async (req: Request, res: Response): Promise<void> => {
    const feedbacks = await Feedback.find().populate({
        path: "lessonId",
        select: "courseId title content type",
    })
        .populate({
            path: "userId",
            select: "firstname lastname email",
        });
    res.status(200).json({
        success: feedbacks ? true : false,
        rs: feedbacks ? feedbacks : 'Feedbacks not found'
    })
}
export const getFeedbackById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing feedback id')
    const feedback = await Feedback.findById(id)
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    })
}

export const createFeedback = async (req: Request, res: Response): Promise<void> => {
    const { userId, lessonId, comment, rating } = req.body
    if (!userId || !lessonId || !comment || !rating) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const feedback = await Feedback.create(req.body)
    await feedback.save()
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    })
}
export const updateFeedback = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { userId, lessonId, comment, rating } = req.body
    if (!id) throw new Error('Missing feedback id')
    if (!userId || !lessonId || !comment || !rating) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const feedback = await Feedback.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    })
}
export const deleteFeedback = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing feedback id')
    const feedback = await Feedback.findByIdAndDelete(id)
    res.status(200).json({
        success: feedback ? true : false,
        rs: feedback ? feedback : 'Feedback not found'
    })
}