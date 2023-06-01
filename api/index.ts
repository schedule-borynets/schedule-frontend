import axios from 'axios';

export const API = axios.create({
    baseURL:
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001/'
            : 'https://schedule-backend-production.up.railway.app/',
    withCredentials: true,
});

API.interceptors.request.use(function (config) {
    const token = localStorage.getItem('access_token');

    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});
