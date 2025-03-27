import { Request, Response } from "express"
import Course from "../models/Course"

export const getCourses = async (req: Request, res: Response): Promise<void> => {
    const courses = await Course.find()
    res.status(200).json({
        success: courses ? true : false,
        rs: courses ? courses : 'Courses not found'
    })
}
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing course id')
    const course = await Course.findById(id)
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    })
}
export const createCourse = async (req: Request, res: Response): Promise<void> => {
    const { title, description, level, thumbnail } = req.body
    console.log(title, description, level, thumbnail);
    if (!title || !level || !thumbnail) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const course = await Course.create(req.body)
    await course.save()
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    })
}
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { title, description, level, thumbnail } = req.body
    if (!id) throw new Error('Missing course id')
    if (!title || !level || !thumbnail) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    })
}
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing course id')
    const course = await Course.findByIdAndDelete(id)
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Course not found'
    })
}