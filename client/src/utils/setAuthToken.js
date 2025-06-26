import axios from "axios";

// This function sets the Authorization header for all Axios requests
const setAuthToken = token => {
  if (token) {
    // If token exists, set it with "Bearer" prefix
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // If no token, remove the Authorization header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
