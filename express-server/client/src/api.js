import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const api = axios.create({
    baseURL: apiUrl, // Adjust if needed
    headers: { "Content-Type": "application/json" },
});

export default api;
