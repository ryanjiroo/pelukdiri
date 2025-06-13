import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

// URL API dari .env
const API_BASE_URL = import.meta.env.VITE_BASE_URL_AUTH;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUserToken, setCurrentUserToken] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserPhone, setCurrentUserPhone] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '', isError: false });

    // Inisialisasi dari sessionStorage saat aplikasi dimuat
    useEffect(() => {
        const storedToken = sessionStorage.getItem('authToken');
        const storedUsername = sessionStorage.getItem('username');
        const storedUserId = sessionStorage.getItem('userId');
        const storedUserPhone = sessionStorage.getItem('userPhone');

        if (storedToken && storedUsername && storedUserId) {
            setCurrentUserToken(storedToken);
            setCurrentUsername(storedUsername);
            setCurrentUserId(storedUserId);
            setCurrentUserPhone(storedUserPhone);
        }
    }, []);

    // Fungsi untuk menampilkan modal notifikasi
    const showModal = useCallback((title, message, isError = false) => {
        setModal({ visible: true, title, message, isError });
    }, []);

    const hideModal = useCallback(() => {
        setModal({ ...modal, visible: false });
    }, [modal]);

    // Fungsi panggilan API generik (diadaptasi dari test.html)
    const apiCall = useCallback(async (endpoint, method = 'GET', body = null, requiresAuth = true) => {
        setIsLoading(true);
        const headers = { 'Content-Type': 'application/json' };
        if (requiresAuth && currentUserToken) {
            headers['Authorization'] = `Bearer ${currentUserToken}`;
        }
        const config = { method, headers };
        if (body) config.data = body;

        try {
            const response = await axios({ url: `${API_BASE_URL}${endpoint}`, ...config });

            if (response.status === 204) return null;
            return response.data;
        } catch (error) {
            console.error('API Call Error:', error);
            const errorMessage = error.response?.data?.message || error.message || `HTTP error! status: ${error.response?.status}`;
            showModal('Error', `Terjadi kesalahan: ${errorMessage}`, true);
            throw error; // Propagate error for specific handling in components
        } finally {
            setIsLoading(false);
        }
    }, [currentUserToken, showModal]);

    // Helper function to parse JWT token
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Failed to parse JWT token:", e);
            return null;
        }
    };

    // Fungsi untuk login
    const login = useCallback(async (username, password) => {
        try {
            const data = await apiCall('/auth/login', 'POST', { username, password }, false);
            if (data && data.token) {
                const decodedToken = parseJwt(data.token);
                const userId = decodedToken ? decodedToken.id : null;

                setCurrentUserToken(data.token);
                setCurrentUsername(data.user?.username || username);
                setCurrentUserId(userId);
                setCurrentUserPhone(data.user?.phone || null);

                sessionStorage.setItem('authToken', data.token);
                sessionStorage.setItem('username', data.user?.username || username);
                sessionStorage.setItem('userId', userId);
                if (data.user?.phone) {
                    sessionStorage.setItem('userPhone', data.user.phone);
                } else {
                    sessionStorage.removeItem('userPhone');
                }

                showModal('Sukses', 'Login berhasil!');
                return true; // Berhasil login
            }
            return false; // Gagal login
        } catch (error) {
            return false;
        }
    }, [apiCall, showModal]);

    // Fungsi untuk register
    const register = useCallback(async (username, password, phone) => {
        try {
            await apiCall('/auth/register', 'POST', { username, password, phone }, false);
            showModal('Sukses', 'Registrasi berhasil! Silakan login.');
            return true; // Berhasil register
        } catch (error) {
            return false;
        }
    }, [apiCall, showModal]);

    // Fungsi untuk logout
    const logout = useCallback(() => {
        setCurrentUserToken(null);
        setCurrentUsername(null);
        setCurrentUserId(null);
        setCurrentUserPhone(null);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userPhone');
        showModal('Info', 'Anda telah logout.');
    }, [showModal]);

    // Function to update user data in AuthContext state and sessionStorage
    const updateAuthUserData = useCallback((updatedUser) => {
        if (updatedUser) {
            setCurrentUsername(updatedUser.username);
            setCurrentUserPhone(updatedUser.phone || null);
            sessionStorage.setItem('username', updatedUser.username);
            if (updatedUser.phone) {
                sessionStorage.setItem('userPhone', updatedUser.phone);
            } else {
                sessionStorage.removeItem('userPhone');
            }
        }
    }, []);

    const authValue = {
        currentUserToken,
        currentUsername,
        currentUserId,
        currentUserPhone,
        isLoading,
        login,
        register,
        logout,
        apiCall,
        updateAuthUserData,
        showModal
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
            {/* Modal Notifikasi (dibuat di sini agar bisa digunakan di seluruh aplikasi) */}
            {modal.visible && (
                <div className="fixed inset-0 bg-opacity-0 flex items-center justify-center z-[1000]" // Changed bg-gray-900 bg-opacity-75 to bg-opacity-0
                     style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}> {/* Latar belakang buram*/}
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
                        <h3 className={`text-xl font-bold mb-3 ${modal.isError ? 'text-red-600' : 'text-[#5C8374]'}`}>
                            {modal.title}
                        </h3>
                        <p className="text-gray-700 mb-4">{modal.message}</p>
                        <button
                            onClick={hideModal}
                            className="w-full bg-[#5C8374] text-white py-2 rounded hover:bg-[#1B4242] transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};