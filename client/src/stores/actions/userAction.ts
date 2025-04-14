import { Dispatch } from "redux";
import { apiGetCurrent } from "../../services/userService";
import actionType from "./actionType";
interface ApiResponse {
  success: boolean;
  response: unknown;
}
interface GetCurrentAction {
  type: typeof actionType.GET_CURRENT;
  currentData: unknown;
  msg?: unknown;
}
export const getCurrent = () => async (dispatch: Dispatch<GetCurrentAction>) => {
  try {
    const response = (await apiGetCurrent()) as unknown as ApiResponse;
    if (response?.success) {
      dispatch({
        type: actionType.GET_CURRENT,
        currentData: response?.response,
      });
    } else {
      dispatch({
        type: actionType.GET_CURRENT,
        currentData: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.GET_CURRENT,
      currentData: null,
      msg: error,
    });
  }
};
