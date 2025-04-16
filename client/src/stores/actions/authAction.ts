import { Dispatch } from "redux";
import { apiLogin, apiLoginSuccess } from "../../services/authService";
import actionType from "./actionType";

interface ApiResponse {
  success: boolean;
  err: number
  data: {
    success?: boolean;
    accessToken?: string;
    token?: string;
    role?: string;
    msg?: string;
  }
}

export interface authActionProps {
  email: string;
  password: string;
}

interface GetCurrentAction {
  type: typeof actionType.GET_CURRENT;
  currentData: unknown;
  msg?: unknown;
}

interface LoginSuccessAction {
  type: typeof actionType.LOGIN_SUCCESS;
  token?: string | null;
  role?: string | null;
  data?: string | null
  msg?: unknown;
}

type AuthAction = GetCurrentAction | LoginSuccessAction;

export const loginAction = (data: authActionProps) => async (dispatch: Dispatch<AuthAction>) => {
  try {
    const response = (await apiLogin(data)) as unknown as ApiResponse;

    if (response?.data) {
      dispatch({
        type: actionType.LOGIN,
        token: response.data.accessToken,
      });
    } else {
      dispatch({
        type: actionType.LOGIN,
        token: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.LOGIN,
      token: null,
      msg: error,
    });
  }
};
export const loginSuccessAction = (id: unknown, tokenLogin: unknown) => async (dispatch: Dispatch<AuthAction>) => {
  try {
    const response = await apiLoginSuccess(id, tokenLogin) as unknown as ApiResponse;
    if (response?.data) {
      dispatch({
        type: actionType.LOGIN_SUCCESS,
        token: response?.data?.token,
        role: response?.data.role,
      });
    } else {
      dispatch({
        type: actionType.LOGIN_SUCCESS,
        token: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.LOGIN_SUCCESS,
      token: null,
      msg: error,
    });
  }
};
export const logout = (): { type: typeof actionType.LOGOUT } => ({
  type: actionType.LOGOUT,
});