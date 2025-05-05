import axiosConfig from "../axios";
import { Enrollment } from "@/types/enrollment";
export const apiGetAllEnrollment = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/enrollment/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all enrollment:", error);
        throw error;
    }
}
export const apiGetEnrollmentById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/enrollment/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching enrollment by ID:", error);
        throw error;
    }
}
export const apiDeleteEnrollmentById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/enrollment/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting enrollment by ID:", error);
        throw error;
    }
}
export const apiCreateEnrollment = async (data: Enrollment) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/enrollment/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current enrollment:", error);
        throw error;
    }
}
export const apiUpdateEnrollment = async (id: string, data: Enrollment) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/enrollment/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current enrollment:", error);
        throw error;
    }
}
