import { Request, Response } from "express"
import Enrollment from "../models/Enrollment"

export const getEnrollments = async (req: Request, res: Response): Promise<void> => {
    const enrollment = await Enrollment.find().populate({
        path: "courseId",
        select: "title description level thumbnail", // Fields to include from the Course model
    })
        .populate({
            path: "userId",
            select: "firstname lastname email", // Fields to include from the User model
        });

    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollments not found'
    })
}
export const getEnrollmentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing enrollment id')
    const enrollment = await Enrollment.findById(id)
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    })
}

export const createEnrollment = async (req: Request, res: Response): Promise<void> => {
    const { courseId, userId, progress, status } = req.body
    if (!courseId || !userId || !progress || !status) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const enrollment = await Enrollment.create(req.body)
    await enrollment.save()
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    })
}
export const updateEnrollment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { courseId, userId, progress, status } = req.body
    if (!id) throw new Error('Missing enrollment id')
    if (!courseId || !userId || !progress || !status) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const enrollment = await Enrollment.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    })
}
export const deleteEnrollment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    console.log(id);
    if (!id) throw new Error('Missing enrollment id')
    const enrollment = await Enrollment.findByIdAndDelete(id)
    res.status(200).json({
        success: enrollment ? true : false,
        rs: enrollment ? enrollment : 'Enrollment not found'
    })
}