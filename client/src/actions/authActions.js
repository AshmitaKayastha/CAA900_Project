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
      let token = res.data.token;

      // ✅ Strip "Bearer " if it's already included
      token = token.replace(/^Bearer\s+/i, "");

      // ✅ Save clean token
      localStorage.setItem("jwtToken", token);

      // ✅ Set Authorization header with proper "Bearer " prefix
      setAuthToken(token); // setAuthToken will add "Bearer " safely

      // ✅ Decode token
      const decoded = jwt_decode(token);

      // ✅ Set user in Redux
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
  // ✅ Remove token from localStorage
  localStorage.removeItem("jwtToken");

  // ✅ Clear Authorization header
  setAuthToken(false);

  // ✅ Clear Redux user
  dispatch(setCurrentUser({}));
};
