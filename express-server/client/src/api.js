import axios from "axios";

const url = process.env.NODE_ENV === 'Production' ? 'https://taskappdeployable.herokuapp.com/api' : 'http://localhost:3000/api';
const api = axios.create({
    baseURL: url,
    headers: { "Content-Type": "application/json" },
});

export default api;
