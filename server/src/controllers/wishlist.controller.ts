import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Lesson from "../models/Lesson";
import WishList from "../models/Wishlist";

// Thêm bài học vào wishlist
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req?.user?._id
        const { lessonId } = req.body;
        if (!userId) {
            throw new Error("Unauthorized");
        }
        // Kiểm tra userId và lessonId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            res.status(400).json({ message: "Invalid userId or lessonId" });
            return
        }

        // Kiểm tra xem user và lesson có tồn tại không
        const user = await User.findById(userId);
        const lesson = await Lesson.findById(lessonId);

        if (!user || !lesson) {
            res.status(404).json({ message: "User or Lesson not found" });
            return
        }

        // Kiểm tra xem bài học đã có trong wishlist chưa
        const existingWishlist = await WishList.findOne({ userId, lessonId });
        if (existingWishlist) {
            res.status(400).json({ message: "Lesson already in wishlist" });
            return
        }

        // Thêm vào wishlist
        const wishlistItem = new WishList({ userId, lessonId });
        await wishlistItem.save();

        res.status(201).json({ message: "Lesson added to wishlist", data: wishlistItem });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Xóa bài học khỏi wishlist
export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req?.user?._id
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const { lessonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            res.status(400).json({ message: "Invalid userId or lessonId" });
            return
        }

        // Xóa bài học khỏi wishlist
        const wishlistItem = await WishList.findOneAndDelete({ userId, lessonId });

        if (!wishlistItem) {
            res.status(404).json({ message: "Wishlist item not found" });
            return
        }

        res.status(200).json({ message: "Lesson removed from wishlist" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Lấy danh sách bài học trong wishlist của user
export const getWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req?.user?._id
        if (!userId) {
            throw new Error("Unauthorized");
        }
        // Lấy danh sách wishlist và populate thông tin bài học
        const wishlist = await WishList.find({ userId }).populate({
            path: "lessonId",
            select: "title type category level thumbnail",
        });

        res.status(200).json({ message: "Wishlist retrieved successfully", data: wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};