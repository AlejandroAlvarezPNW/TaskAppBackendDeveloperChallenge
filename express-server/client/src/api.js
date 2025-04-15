import axios from "axios";

const url = process.env.REACT_APP_NODE_ENV === 'Production' ? 'https://taskappdeployable-2815f043dfd0.herokuapp.com/api' : 'http://localhost:3000/api';
//const url = 'https://taskappdeployable-2815f043dfd0.herokuapp.com/api'; //This is needed during build time for the front-end
console.log("url:", url);
console.log("REACT_APP_NODE_ENV:Frontend:", process.env.REACT_APP_NODE_ENV);
const api = axios.create({
    baseURL: url,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export default api;
