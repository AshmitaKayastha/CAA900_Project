// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5001/api',
    UPLOAD_BASE_URL: 'http://localhost:5001',
    CORS_ORIGIN: 'http://localhost:3000'
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://elearners-g3gshfgvbhetg0fp.canadacentral-01.azurewebsites.net/api',
    UPLOAD_BASE_URL: process.env.REACT_APP_BASE_URL || 'https://elearners-g3gshfgvbhetg0fp.canadacentral-01.azurewebsites.net',
    CORS_ORIGIN: process.env.REACT_APP_BASE_URL || 'https://elearners-g3gshfgvbhetg0fp.canadacentral-01.azurewebsites.net'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
export const API_BASE_URL = config[environment].API_BASE_URL;
export const UPLOAD_BASE_URL = config[environment].UPLOAD_BASE_URL;
export const CORS_ORIGIN = config[environment].CORS_ORIGIN;

export default config[environment];