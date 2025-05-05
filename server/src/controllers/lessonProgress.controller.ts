
import { Request, Response } from "express"
import LessonProgress from "../models/LessonProgress";

export const getLessonProgresses = async (req: Request, res: Response): Promise<void> => {
    const lessonProgress = await LessonProgress.find().populate({
        path: "lessonId",
        select: "courseId title content type", // Fields to include from the Course model
    })
        .populate({
            path: "userId",
            select: "firstname lastname email", // Fields to include from the User model
        });
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    })
}
export const getLessonProgressById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing lessonProgress id')
    const lessonProgress = await LessonProgress.findById(id)
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    })
}

export const createLessonProgress = async (req: Request, res: Response): Promise<void> => {
    const { lessonId, userId, score } = req.body
    if (!lessonId || !userId || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const lessonProgress = await LessonProgress.create(req.body)
    await lessonProgress.save()
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    })
}
export const updateLessonProgress = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { lessonId, userId, score } = req.body
    if (!id) throw new Error('Missing lessonProgress id')
    if (!lessonId || !userId || !score) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const lessonProgress = await LessonProgress.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    })
}
export const deleteLessonProgress = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing lessonProgress id')
    const lessonProgress = await LessonProgress.findByIdAndDelete(id)
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    })
}