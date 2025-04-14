import axiosConfig from "../axios";
export const apiGetAllUser = async () => {
  try {
    const response = await axiosConfig({
      method: "GET",
      url: "/users",
    });
    return response;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}
export const apiGetUserById = async (id: string) => {
  try {
    const response = await axiosConfig({
      method: "GET",
      url: "/users/getUserById/" + id,
    });
    return response;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}
export const apiDeleteUserById = async (id: string) => {
  try {
    const response = await axiosConfig({
      method: "DELETE",
      url: "/users/delete/" + id,
    });
    return response;
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    throw error;
  }
}
export const apiGetCurrent = async () => {
  try {
    const response = await axiosConfig({
      method: "GET",
      url: "/users/get-current",
    });
    return response;
  } catch (error) {
    console.log("Error fetching current user:", error);
    throw error;
  }
}
