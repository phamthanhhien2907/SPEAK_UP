
import { Request, Response } from "express"
import Lesson from "../models/Lesson";

export const getLessons = async (req: Request, res: Response): Promise<void> => {
    const lessons = await Lesson.find()
    res.status(200).json({
        success: lessons ? true : false,
        rs: lessons ? lessons : 'Lessons not found'
    })
}
export const getLessonById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing lesson id')
    const lesson = await Lesson.findById(id)
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    })
}
export const createLesson = async (req: Request, res: Response): Promise<void> => {
    const { courseId, title, content, type } = req.body
    if (!courseId || !title || !type) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const lesson = await Lesson.create(req.body)
    await lesson.save()
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    })
}
export const updateLesson = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { courseId, title, content, type } = req.body
    if (!id) throw new Error('Missing lesson id')
    if (!courseId || !title || !type) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const lesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    })
}
export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing lesson id')
    const lesson = await Lesson.findByIdAndDelete(id)
    res.status(200).json({
        success: lesson ? true : false,
        rs: lesson ? lesson : 'Lesson not found'
    })
}