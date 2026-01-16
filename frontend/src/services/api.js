import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3001/api'; // hard coding it now is fine but remember to change. tyis if deployed or used anywhere else.

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
    }
);

export default api;
