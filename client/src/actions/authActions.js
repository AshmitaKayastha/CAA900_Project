import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

const API_URL = "http://localhost:5001/api/users";

// ===============================
// ✅ REGISTER USER
// ===============================
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

// ===============================
// ✅ LOGIN USER
// ===============================
export const loginUser = userData => dispatch => {
  axios
    .post(`${API_URL}/login`, userData)
    .then(res => {
      const { token, user } = res.data;
      const cleanToken = token.replace(/^Bearer\s+/i, "");

      localStorage.setItem("jwtToken", cleanToken);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthToken(cleanToken);
      const decoded = jwt_decode(cleanToken);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { general: "Login failed. Please try again." }
      })
    );
};

// ===============================
// ✅ SET CURRENT USER
// ===============================
export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

// ===============================
// ✅ LOGOUT USER
// ===============================
export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};