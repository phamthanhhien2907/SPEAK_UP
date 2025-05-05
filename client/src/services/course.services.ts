import { Course } from "@/types/course";
import axiosConfig from "../axios";
export const apiGetAllCourse = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/courses/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all courses:", error);
        throw error;
    }
}
export const apiGetCourseById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/courses/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        throw error;
    }
}
export const apiDeleteCourseById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/courses/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting course by ID:", error);
        throw error;
    }
}
export const apiCreateCourse = async (data: Course) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/courses/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current course:", error);
        throw error;
    }
}
export const apiUpdateCourse = async (id: string, data: Course) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/courses/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current course:", error);
        throw error;
    }
}
