import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

const API_URL = "http://localhost:5001/api/users";

// REGISTER User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post(`${API_URL}/register`, userData)
    .then(() => history.push("/login"))
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

      // ✅ Save raw token (no Bearer)
      localStorage.setItem("jwtToken", token);

      // ✅ Set token in axios headers as Bearer
      setAuthToken(token);

      // Decode token
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      const errors =
        err.response?.data && typeof err.response.data === "object"
          ? err.response.data
          : { general: "Login failed. Please try again." };

      dispatch({
        type: GET_ERRORS,
        payload: errors
      });
    });
};

// Set current user
export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

// Logout user
export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
