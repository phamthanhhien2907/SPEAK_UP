
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
    const { lessonId, userId, score, isCompleted } = req.body
    if (!lessonId || !userId || !score || !isCompleted) {
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
    const { lessonId, userId, score, isCompleted } = req.body

    if (!id) throw new Error('Missing lessonProgress id')
    if (!lessonId || !userId || !score || !isCompleted) {
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
export const updateLessonProgressByLessonId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { lessonId } = req.params;
        const { userId, score, isCompleted } = req.body;
        if (!lessonId) {
            res.status(400).json({ success: false, rs: "Missing lessonId" });
            return;
        }
        if (!userId || score === undefined || isCompleted === undefined) {
            res.status(400).json({ success: false, rs: "Missing required fields (userId, score, or isCompleted)" });
            return;
        }

        // Kiểm tra kiểu dữ liệu
        if (typeof score !== "number" || typeof isCompleted !== "boolean") {
            res.status(400).json({ success: false, rs: "Invalid data types (score must be number, isCompleted must be boolean)" });
            return;
        }

        // Tìm và cập nhật bản ghi dựa trên lessonId và userId
        const progress = await LessonProgress.findOneAndUpdate(
            { lessonId, userId },
            { score, isCompleted, updatedAt: new Date() },
            { new: true, upsert: true } // Tạo mới nếu không tồn tại
        );

        if (!progress) {
            res.status(404).json({ success: false, rs: "LessonProgress not found and could not be created" });
            return;
        }

        res.status(200).json({ success: true, rs: progress });
    } catch (error) {
        console.error("Error updating lesson progress:", error);
        res.status(500).json({ success: false, rs: "Internal server error" });
    }
};
export const deleteLessonProgress = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing lessonProgress id')
    const lessonProgress = await LessonProgress.findByIdAndDelete(id)
    res.status(200).json({
        success: lessonProgress ? true : false,
        rs: lessonProgress ? lessonProgress : 'LessonProgress not found'
    })
}