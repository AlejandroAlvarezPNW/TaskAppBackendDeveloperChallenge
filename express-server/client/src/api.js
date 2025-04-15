import axios from "axios";

const url = process.env.REACT_APP_NODE_ENV === 'localhost' ? 'http://localhost:3000/api': 'https://taskappdeployable.herokuapp.com/api';
console.log("REACT_APP_NODE_ENV:Frontend:", process.env.REACT_APP_NODE_ENV);
const api = axios.create({
    baseURL: url,
    headers: { "Content-Type": "application/json" },
});

export default api;
