// src/lib/apiClient.js
import axios from 'axios'

// 우선순위: 환경변수 > Render 배포 > localhost
const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    'https://silvercare-backend.onrender.com' ||
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

//
//
// // src/lib/apiClient.js
// import axios from 'axios'
//
// // 우선순위: 환경변수 > ngrok > localhost
// const API_BASE =
//     import.meta.env.VITE_API_BASE_URL ||
//     'https://d32cc7c8eb4b.ngrok-free.app' ||
//     'http://localhost:8080'
//
// const api = axios.create({
//     baseURL: API_BASE,
//     timeout: 15000,
//     withCredentials: false,
//     headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//     },
// })
//
// export default api
