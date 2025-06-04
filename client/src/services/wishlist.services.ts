import { Wishlist } from "@/types/wishlist";
import axiosConfig from "../axios";
export const apiGetWishlist = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/wishlist/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all wishlist:", error);
        throw error;
    }
}
export const apiRemoveWishlist = async (lessonId: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/wishlist/remove" + lessonId,
        });
        return response;
    } catch (error) {
        console.error("Error deleting wishlist by ID:", error);
        throw error;
    }
}
export const apiAddWishlist = async (data: Wishlist) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/wishlist/add",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current wishlist:", error);
        throw error;
    }
}
