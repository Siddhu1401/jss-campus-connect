import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// User endpoints
export const userAPI = {
    register: (name, email, password, role) =>
        api.post('/users/register', { name, email, password, role }),
    login: (email, password) =>
        api.post('/users/login', { email, password }),
    getProfile: () =>
        api.get('/users/me'),
};

// Resources endpoints
export const resourceAPI = {
    getAllResources: () =>
        api.get('/resources'),
    getResourceById: (id) =>
        api.get(`/resources/${id}`),
    createResource: (data) =>
        api.post('/resources', data),
    deleteResource: (id) =>
        api.delete(`/resources/${id}`),
    verifyResource: (id) =>
        api.patch(`/resources/${id}/verify`),
};

// Attendance endpoints
export const attendanceAPI = {
    addSubject: (data) =>
        api.post('/attendance/subjects', data),
    getSubjects: () =>
        api.get('/attendance/subjects'),
    updateAttendance: (id, data) =>
        api.patch(`/attendance/subjects/${id}`, data),
};

export default api;
