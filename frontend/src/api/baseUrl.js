
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001/api")
  .replace("/api", "");

export default BASE_URL;
