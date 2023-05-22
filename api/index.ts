import axios from 'axios';

export const API = axios.create({
    baseURL: 'http://localhost:3001/',
    withCredentials: true,
});

API.interceptors.request.use(function (config) {
    const token = localStorage.getItem('access_token');

    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});
