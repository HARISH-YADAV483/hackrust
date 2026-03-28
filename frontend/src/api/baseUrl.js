// Base URL for static uploads (images)
// Set VITE_API_URL to your Render backend URL in production
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001/api")
  .replace("/api", "");

export default BASE_URL;
