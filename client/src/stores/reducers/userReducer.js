import actionType from "../actions/actionType";

const initState = {
  userData: {},
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case actionType.GET_CURRENT:
      return {
        ...state,
        currentData: action.currentData || {},
      };
    default:
      return state;
  }
};
export default userReducer;
