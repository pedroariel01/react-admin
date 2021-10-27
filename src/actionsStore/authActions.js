import axios from "axios";
import jwt_decode from "jwt-decode";

import { SET_CURRENT_USER, GET_ERRORS } from "./action-types/types";
import { apiClient } from "../api/httpClient";

// Register User
export const registerUser = (userData, history) => dispatch => {
  return axios
    .post("/auth/users/register", userData)
    .then(res => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });

      history.push("/admin/login");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const changeUserPassword = userData => dispatch => {
  return apiClient
    .post("/auth/changepassword", userData)
    .then(res => console.log(res))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = (userData, history) => dispatch => {
  return axios
    .post("/token-auth/", userData)
    .then(res => {
      const { token } = res.data;

      localStorage.setItem("jwtToken", token);
      axios.defaults.headers.common["Authorization"] = token;

      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });

      history.push("/");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = history => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");

  delete axios.defaults.headers.common["Authorization"];

  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));

  history.push("/admin/login");
};
