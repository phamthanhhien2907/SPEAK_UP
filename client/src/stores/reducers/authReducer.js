import actionType from "../actions/actionType";
const initState = {
  isLoggedIn: false,
  token: null,
  current: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionType.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: action.token ? true : false,
        token: action.token,
      };
    case actionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        current: null,
      };
    default:
      return state;
  }
};
export default authReducer;
