import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

// Create an Axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 30000
})
 
// Adding a request interceptor
api.interceptors.request.use(
    (config) => {
        // Attach token if exists
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// Adding a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) =>{
        // Handle global errors (404, 401 ...)
        if(error.response?.status === 401){
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api