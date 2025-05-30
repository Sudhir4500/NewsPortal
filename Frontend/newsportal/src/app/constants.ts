// src/constants.ts

// Access the API_BASE_URL from the environment variables
const API_BASE_URL = process.env.API_BASE_URL;

// Throw an error if API_BASE_URL is not defined
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in the environment variables.");
}

// Export the constant
export { API_BASE_URL };