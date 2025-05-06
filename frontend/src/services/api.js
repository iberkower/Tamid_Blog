import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            // Handle access denied error
            console.error('Access denied:', error.response.data.error);
        }
        return Promise.reject(error);
    }
);

export const signup = async (name, email, password) => {
    try {
        const response = await api.post('/auth/signup', { name, email, password });
        console.log('Signup response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Signup API error:', error.response?.data || error);
        throw error;
    }
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const getPosts = async (filters = {}) => {
    try {
        const response = await api.get('/posts', { params: filters });
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            // If access denied, try again without private posts
            const response = await api.get('/posts', {
                params: { ...filters, includePrivate: false }
            });
            return response.data;
        }
        throw error;
    }
};

export const getPost = async (id) => {
    try {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            throw new Error('This post is private');
        }
        throw error;
    }
};

export const createPost = async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
};

export const updatePost = async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
}; 