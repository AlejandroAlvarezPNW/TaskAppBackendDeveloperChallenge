import axios from "axios";

const url = process.env.REACT_APP_NODE_ENV === 'Production' ? 'https://taskappdeployable.herokuapp.com/api' : 'http://localhost:3000/api';
console.log("url:", url);
console.log("REACT_APP_NODE_ENV:Frontend:", process.env.REACT_APP_NODE_ENV);
const api = axios.create({
    baseURL: url,
    headers: { "Content-Type": "application/json" },
});

export default api;
