import axiosConfig from "../axios";
import { authActionProps } from "../stores/actions/authAction";
export const apiRegister = async (data: authActionProps) => {
  try {
    const response = await axiosConfig({
      method: "POST",
      url: "/auth/register",
      data,
    });
    return response;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};
export const apiLogin = async (data: authActionProps) => {
  try {
    const response = await axiosConfig({
      method: "POST",
      url: "/auth/login",
      data,
      withCredentials: true
    })
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
export const apiLoginSuccess = async (id: unknown, tokenLogin: unknown) => {
  try {
    const response = await axiosConfig({
      method: "POST",
      url: "/auth/login-success",
      data: { id, tokenLogin },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}