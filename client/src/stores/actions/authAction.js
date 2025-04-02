import { apiLoginSuccess } from "../../services/authService";
import actionType from "./actionType";
export const loginSuccessAction = (data) => async (dispatch) => {
  try {
    let response = apiLoginSuccess(data);
    console.log(response);
    response.then(function (result) {
      if (result.accessToken) {
        dispatch({
          type: actionType.LOGIN_SUCCESS,
          token: result.accessToken,
        });
      } else {
        dispatch({
          type: actionType.LOGIN_SUCCESS,
          data: null,
        });
      }
    });
  } catch (error) {
    dispatch({
      type: actionType.LOGIN_SUCCESS,
      data: null,
      msg: error,
    });
  }
};
export const logout = () => ({
  type: actionType.LOGOUT,
});
