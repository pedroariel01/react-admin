import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import notificationReducer from "./notificationReducer";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  notifications: notificationReducer
});
