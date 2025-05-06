import { Request, Response } from "express";

import mongoose from "mongoose";
import LessonProgress from "../models/LessonProgress";
import Lesson from "../models/Lesson";

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        // Lấy những lesson progress của user
        const progressList = await LessonProgress.find({ userId });

        // Gom lại theo lessonId và score
        const completedLessonIds = progressList.map(p => p.lessonId.toString());

        // Gợi ý những bài học chưa hoàn thành
        const recommendedLessons = await Lesson.find({
            _id: { $nin: completedLessonIds.map(id => new mongoose.Types.ObjectId(id)) }
        })
            .limit(5)
            .populate("courseId") // nếu muốn lấy thêm thông tin khóa học

        res.json({
            message: "Recommended lessons",
            data: recommendedLessons
        });
    } catch (error) {
        console.error("Recommendation error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
