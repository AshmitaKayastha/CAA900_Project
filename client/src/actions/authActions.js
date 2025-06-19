import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Base API URL
const API_URL = "http://localhost:5001/api/users";

// REGISTER User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post(`${API_URL}/register`, userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { general: "Registration failed" }
      })
    );
};

// LOGIN User
export const loginUser = userData => dispatch => {
  axios
    .post(`${API_URL}/login`, userData)
    .then(res => {
      const { token } = res.data;

      // Save token to localStorage
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      let errors = {};
      if (err.response && err.response.data) {
        errors = typeof err.response.data === "object"
          ? err.response.data
          : { general: err.response.data };
      } else {
        errors = { general: "Login failed. Please try again." };
      }

      dispatch({
        type: GET_ERRORS,
        payload: errors
      });
    });
};

// SET current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// LOGOUT user
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");

  // Remove Auth header
  setAuthToken(false);

  // Clear user from Redux store
  dispatch(setCurrentUser({}));
};
