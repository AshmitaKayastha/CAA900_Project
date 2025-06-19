// import axios from "axios"; // Original axios
import axios from "../utils/axiosInstance"; // ✅ Optional: Use centralized instance

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from "./types";

// =======================
// 🔄 Get Current Profile
// =======================
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// =======================
// 🔍 Get Profile by Handle
// =======================
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/profile/handle/${handle}`)
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

// =======================
// ➕ Create Profile
// =======================
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/profile", profileData)
    .then(res => history.push("/finaldashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: "Server error" }
      })
    );
};

// =======================
// ➕ Add Experience
// =======================
export const addExperience = (expData, history) => dispatch => {
  axios
    .post("/profile/experience", expData)
    .then(res => history.push("/finaldashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: "Failed to add experience" }
      })
    );
};

// =======================
// ➕ Add Education
// =======================
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post("/profile/education", eduData)
    .then(res => history.push("/finaldashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: "Failed to add education" }
      })
    );
};

// =======================
// ❌ Delete Experience
// =======================
export const deleteExperience = id => dispatch => {
  axios
    .delete(`/profile/experience/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: "Failed to delete experience" }
      })
    );
};

// =======================
// ❌ Delete Education
// =======================
export const deleteEducation = id => dispatch => {
  axios
    .delete(`/profile/education/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: "Failed to delete education" }
      })
    );
};

// =======================
// 🌍 Get All Profiles
// =======================
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/profile/all")
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

// =======================
// ⚠️ Delete Account & Profile
// =======================
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete("/profile")
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response?.data || { message: "Failed to delete account" }
        })
      );
  }
};

// =======================
// 🔄 Set Profile Loading
// =======================
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// =======================
// ♻️ Clear Current Profile
// =======================
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
