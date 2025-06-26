import axios from "axios";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from "./types";

// Set token from localStorage on axios
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
  }
});

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("http://localhost:5001/api/profile", authHeader())
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: typeof err.response?.data === "object" ? err.response.data : {}
      })
    );
};

// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`http://localhost:5001/api/profile/handle/${handle}`, authHeader())
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("http://localhost:5001/api/profile", profileData, authHeader())
    .then(() => history.push("/finaldashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: typeof err.response?.data === "object" ? err.response.data : { general: "Profile creation failed" }
      })
    );
};

// Add experience
export const addExperience = (expData, history) => dispatch => {
  axios
    .post("http://localhost:5001/api/profile/experience", expData, authHeader())
    .then(() => history.push("/finaldashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { general: "Experience add failed" }
      })
    );
};

// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post("http://localhost:5001/api/profile/education", eduData, authHeader())
    .then(() => history.push("/finaldashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { general: "Education add failed" }
      })
    );
};

// Delete Experience
export const deleteExperience = id => dispatch => {
  axios
    .delete(`http://localhost:5001/api/profile/experience/${id}`, authHeader())
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { general: "Experience delete failed" }
      })
    );
};

// Delete Education
export const deleteEducation = id => dispatch => {
  axios
    .delete(`http://localhost:5001/api/profile/education/${id}`, authHeader())
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { general: "Education delete failed" }
      })
    );
};

// Get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("http://localhost:5001/api/profile/all", authHeader())
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(() =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

// Delete account & profile
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete("http://localhost:5001/api/profile", authHeader())
      .then(() =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response?.data || { general: "Account deletion failed" }
        })
      );
  }
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
