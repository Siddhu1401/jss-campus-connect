import React, { createContext, useState, useContext, useEffect } from 'react';
import { userAPI } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setUser(null);
            localStorage.removeItem('token');
            setToken(null);
            setError(err.response?.data?.msg || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, role) => {
        try {
            setLoading(true);
            const response = await userAPI.register(name, email, password, role);
            setError(null);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Registration failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await userAPI.login(email, password);
            const { token: newToken } = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setError(null);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Login failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
