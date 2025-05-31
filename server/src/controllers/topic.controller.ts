import { Request, Response } from "express"
import Topic from "../models/Topic"
import LessonProgress from "../models/LessonProgress";
import Lesson from "../models/Lesson";

export const getTopics = async (req: Request, res: Response): Promise<void> => {
    const userId = req?.user?._id;

    // Kiểm tra userId
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        // Lấy tất cả topics
        const topics = await Topic.find().lean().populate({
            path: "courseId",
            select: "title description level thumbnail",
        })


        if (!topics || topics.length === 0) {
            res.status(200).json({
                success: false,
                rs: "Topics not found",
            });
            return;
        }

        // Lấy tất cả bài học thuộc các topics
        const topicIds = topics.map((t) => t._id);
        const lessons = await Lesson.find({
            parentTopicId: { $in: topicIds },
        }).lean();

        // Lấy tiến độ của người dùng cho các bài học
        const lessonIds = lessons.map((l) => l._id);
        const progresses = await LessonProgress.find({
            userId,
            lessonId: { $in: lessonIds },
        }).lean();

        // Tạo map để truy cập nhanh tiến độ
        const progressMap = new Map(progresses.map((p) => [p.lessonId.toString(), p]));

        // Tính toán progressText cho từng topic
        const result = topics.map((topic) => {
            // Lấy các bài học thuộc topic hiện tại
            const topicLessons = lessons.filter(
                (l) => l.parentTopicId?.toString() === topic._id.toString()
            );

            // Tổng số bài học (dựa trên totalLessons trong TopicSchema)
            const total = topic.totalLessons;

            // Số bài học đã hoàn thành (score >= 60)
            const completed = topicLessons.filter((l) => {
                const progress = progressMap.get(l._id.toString());
                return (progress?.score ?? 0) >= 60;
            }).length;

            // Tạo progressText dạng "X/Y Bài học"
            const progressText = `${completed}/${total} Bài học`;

            return {
                ...topic,
                progressText, // Thêm progressText vào kết quả
            };
        });

        res.status(200).json({
            success: true,
            rs: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách topic" });
    }
};
export const getTopicById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing course id')
    const course = await Topic.findById(id)
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Topic not found'
    })
}
export const createTopic = async (req: Request, res: Response): Promise<void> => {
    const { title, description, level, thumbnail } = req.body
    console.log(title, description, level, thumbnail);
    if (!title || !level || !thumbnail) {
        res.status(400).json({
            success: false,
            rs: 'Missing inputs'
        })
        return
    }
    const course = await Topic.create(req.body)
    await course.save()
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Topic not found'
    })
}
export const updateTopic = async (req: Request, res: Response): Promise<void> => {
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
    const course = await Topic.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Topic not found'
    })
}
export const deleteTopic = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (!id) throw new Error('Missing course id')
    const course = await Topic.findByIdAndDelete(id)
    res.status(200).json({
        success: course ? true : false,
        rs: course ? course : 'Topic not found'
    })
}