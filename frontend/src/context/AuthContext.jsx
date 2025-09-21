import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// A simple function to decode a JWT payload without external libraries.
// This does not verify the signature, it only decodes the payload.
const manualJwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on initial load
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = manualJwtDecode(token);
                if (decodedToken) {
                    // Check if token is expired
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp > currentTime) {
                        setUser({ id: decodedToken.user_id, username: decodedToken.username });
                    } else {
                        // Token is expired
                        localStorage.removeItem('authToken');
                    }
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login/', { username, password });
        const { access: token } = response.data;
        localStorage.setItem('authToken', token);
        const decodedToken = manualJwtDecode(token);
        setUser({ id: decodedToken.user_id, username: decodedToken.username });
    };

    const signup = async (userData) => {
        await api.post('/register/', userData);
        // After successful signup, log the user in
        await login(userData.username, userData.password);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
