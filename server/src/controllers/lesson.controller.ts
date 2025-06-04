
import { Request, Response } from "express"
import Lesson from "../models/Lesson";
import LessonProgress from "../models/LessonProgress";

export const getLessons = async (req: Request, res: Response): Promise<void> => {
    const lessons = await Lesson.find().populate({
        path: "courseId",
        select: "title description level thumbnail",
    }).populate({
        path: "parentTopicId",
        select: "title content",
    }).populate({
        path: "parentLessonId",
        select: "title content",
    });


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

export const getParentLessons = async (req: Request, res: Response): Promise<void> => {
    const userId = req?.user?._id;
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        // Lấy tất cả bài học cha với type: "pronunciation"
        const parentLessons = await Lesson.find({
            parentLessonId: null,
        }).lean();

        // Lấy tất cả bài học con của các bài học cha
        const parentLessonIds = parentLessons.map(l => l._id);
        const subLessons = await Lesson.find({
            parentLessonId: { $in: parentLessonIds }
        }).lean();

        // Lấy tiến độ của người dùng cho cả bài học cha và bài học con
        const allLessonIds = [...parentLessons.map(l => l._id), ...subLessons.map(l => l._id)];
        const progresses = await LessonProgress.find({
            userId,
            lessonId: { $in: allLessonIds }
        }).lean();

        const progressMap = new Map(progresses.map(p => [p.lessonId.toString(), p]));

        // Tính toán tiến độ cho từng bài học cha
        const result = parentLessons.map(parent => {
            const parentSubLessons = subLessons.filter(l => l.parentLessonId?.toString() === parent._id.toString());
            const total = parentSubLessons.length;
            if (total === 0) {
                return null; // Bỏ qua bài học cha không có bài học con
            }
            const completed = parentSubLessons.filter(l => {
                const progress = progressMap.get(l._id.toString());
                return (progress?.score ?? 0) >= 60;
            }).length;
            const progressText = `${completed}/${total} Bài học`;

            return {
                _id: parent._id,
                thumbnail: parent.thumbnail,
                title: parent.title,
                level: parent.level || "Uncategorized",
                score: progressMap.get(parent._id.toString())?.score || 0,
                isCompleted: (progressMap.get(parent._id.toString())?.score || 0) >= 60,
                progress: progressText,
                parrent: parent,
                totalLessons: total
            };
        }).filter(item => item !== null);
        res.json({
            success: result ? true : false,
            rs: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bài học cha" });
    }
};
// export const getParentLessons = async (req: Request, res: Response): Promise<void> => {
//     const userId = req?.user?._id;
//     if (!userId) {
//         throw new Error("Unauthorized");
//     }
//     try {
//         // Lấy tất cả bài học cha với type: "pronunciation"
//         const parentLessons = await Lesson.find({
//             parentLessonId: null,
//         }).lean();
//         res.json({
//             success: parentLessons ? true : false,
//             rs: parentLessons
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Lỗi khi lấy danh sách bài học cha" });
//     }
// };
export const getLessonsByParent = async (req: Request, res: Response): Promise<void> => {
    const userId = req?.user?._id
    if (!userId) {
        throw new Error('Unauthorized')
    }
    const { parentLessonId } = req.params;
    try {
        // Lấy thông tin bài học cha
        const parentLesson = await Lesson.findById(parentLessonId).lean();
        if (!parentLesson) {
            res.status(404).json({ message: "Bài học cha không tồn tại" });
            return
        }

        // Lấy danh sách bài học con
        const lessons = await Lesson.find({ parentLessonId }).lean();
        const progresses = await LessonProgress.find({ userId, lessonId: { $in: lessons.map(l => l._id) } }).lean();

        const progressMap = new Map(progresses.map(p => [p.lessonId.toString(), p]));

        // Xử lý thông tin bài học con
        const result = lessons.map(lesson => ({
            lessonId: lesson._id,
            title: lesson.title,
            score: progressMap.get(lesson._id.toString())?.score || 0,
            isCompleted: (progressMap.get(lesson._id.toString())?.score || 0) >= 60,
        }));

        const completed = result.filter(l => l.isCompleted).length;
        const total = result.length;

        // Trả về thông tin bao gồm bài học cha và danh sách bài học con
        res.json({
            introVideo: "Video Giới thiệu", // Giả định, có thể lấy từ trường khác hoặc cấu hình
            progress: `${completed}/${total}`,
            levelName: `Level ${parentLesson.level || 1} - ${parentLesson.title}`,
            lessons: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu bài học con" });
    }
};
export const getLessonByParentTopicId = async (req: Request, res: Response): Promise<void> => {
    const { parentTopicId } = req.params;
    const userId = req?.user?._id;
    console.log(parentTopicId);
    // Kiểm tra userId và parentTopicId
    if (!userId) {
        throw new Error("Unauthorized");
    }
    if (!parentTopicId) {
        throw new Error("Missing parent topic id");
    }

    try {
        // Lấy tất cả bài học thuộc parentTopicId
        const lessons = await Lesson.find({ parentTopicId: parentTopicId })
            .populate({
                path: "parentTopicId",
                select: "title content level thumbnail totalLessons section",
            })
            .lean();

        if (!lessons || lessons.length === 0) {
            res.status(200).json({
                success: false,
                rs: "Lessons not found",
            });
            return;
        }

        // Lấy tiến độ của người dùng cho các bài học
        const lessonIds = lessons.map((l) => l._id);
        const progresses = await LessonProgress.find({
            userId,
            lessonId: { $in: lessonIds },
        }).lean();

        // Tạo map để truy cập nhanh tiến độ
        const progressMap = new Map(progresses.map((p) => [p.lessonId.toString(), p]));

        // Tính toán score, isCompleted, và progress cho từng bài học
        const result = lessons.map((lesson) => {
            const progress = progressMap.get(lesson._id.toString());
            const score = progress?.score || 0;
            const isCompleted = score >= 60;

            // Tính progress: vì không có bài học con trực tiếp ở đây, progress sẽ dựa trên trạng thái hoàn thành
            const progressText = isCompleted ? "Hoàn thành" : "Chưa hoàn thành";

            return {
                ...lesson,
                score,
                isCompleted,
                progress: progressText,
            };
        });

        res.status(200).json({
            success: true,
            rs: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bài học" });
    }
};
