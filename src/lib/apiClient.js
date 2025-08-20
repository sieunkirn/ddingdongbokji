// // src/lib/apiClient.js
// console.log("API BASE =", import.meta.env.VITE_API_BASE_URL);
//
// import axios from 'axios';
//
// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     timeout: 15000,
// });
//
// export default api;

// src/lib/apiClient.js
import axios from 'axios'

// 우선순위: 환경변수 > ngrok > localhost
const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    'https://d32cc7c8eb4b.ngrok-free.app' ||
    'http://localhost:8080'

const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

export default api
