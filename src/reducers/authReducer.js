import jwt_decode from "jwt-decode";

import { SET_CURRENT_USER } from "../actionsStore/action-types/types";
import isEmpty from "../utils/utils";

const token = localStorage.getItem("jwtToken");

const initialState = {
  isAuthenticated: !!token,
  user: token ? jwt_decode(token) : {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
