// Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { currentUserToken, currentUsername, currentUserPhone, isLoading, apiCall, logout } = useAuth(); // Added currentUserPhone
    const navigate = useNavigate();

    const [editUsername, setEditUsername] = useState(currentUsername || '');
    const [editPassword, setEditPassword] = useState('');
    const [editPhone, setEditPhone] = useState(currentUserPhone || ''); // Added editPhone state

    // Redirect jika belum login
    useEffect(() => {
        if (!currentUserToken) {
            navigate('/login');
        } else {
            setEditUsername(currentUsername || ''); // Pastikan username di form terisi saat komponen dimuat
            setEditPhone(currentUserPhone || ''); // Populate phone field
        }
    }, [currentUserToken, navigate, currentUsername, currentUserPhone]); // Added currentUserPhone to dependency array

    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        const newUsername = editUsername.trim();
        const newPassword = editPassword;
        const newPhone = editPhone.trim(); // Get new phone value

        if (!newUsername) {
            // Notifikasi error akan muncul dari AuthContext
            return;
        }

        const body = {};

        // Only add to body if there's a change from current values
        if (newUsername !== currentUsername) {
            body.username = newUsername;
        }
        if (newPassword) { // Only send password if it's not empty
            body.password = newPassword;
        }
        if (newPhone !== (currentUserPhone || '')) { // Compare with currentPhone, handle null/empty string
            body.phone = newPhone;
        }

        if (Object.keys(body).length === 0) {
            // If no changes, show a message and do nothing
            return; // No changes to submit
        }

        try {
            const data = await apiCall('/auth/update-profile', 'PUT', body, true);
            if (data && data.user) {
                // If AuthContext doesn't automatically update currentUsername and currentUserPhone
                // based on the response of update-profile, you might need to update them here:
                // setCurrentUsername(data.user.username);
                // setCurrentUserPhone(data.user.phone);
                // sessionStorage.setItem('username', data.user.username);
                // if (data.user.phone) {
                //     sessionStorage.setItem('userPhone', data.user.phone);
                // } else {
                //     sessionStorage.removeItem('userPhone');
                // }
                setEditPassword(''); // Kosongkan password field setelah update
            }
        } catch (error) {
            // Error sudah ditangani di apiCall
        }
    };

    const handleLogout = () => {
        logout(); // Panggil fungsi logout dari AuthContext
    };

    if (!currentUserToken) {
        return (
            <div className="min-h-screen bg-[#092635] flex items-center justify-center text-[#9EC8B9]">
                Memuat atau mengarahkan...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#092635] flex items-center justify-center p-4">
            <div className="bg-[#1B4242] rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md text-[#9EC8B9]">
                <h2 className="text-3xl font-bold text-center mb-8 text-[#9EC8B9]">Profil Pengguna</h2>

                <form onSubmit={handleEditProfileSubmit} className="space-y-6 mb-8">
                    <div>
                        <label htmlFor="editUsername" className="block text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            id="editUsername"
                            className="w-full p-3 rounded-lg border border-[#5C8374] bg-[#092635] text-[#9EC8B9] placeholder-[#5C8374] focus:ring-2 focus:ring-[#9EC8B9] focus:border-transparent outline-none"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="editPhone" className="block text-sm font-medium mb-2">Nomor Telepon</label>
                        <input
                            type="number" // Changed to number
                            id="editPhone"
                            className="w-full p-3 rounded-lg border border-[#5C8374] bg-[#092635] text-[#9EC8B9] placeholder-[#5C8374] focus:ring-2 focus:ring-[#9EC8B9] focus:border-transparent outline-none"
                            placeholder="Diawali 62 (Contoh: 6281234567890)"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-[#D6FFEF] mt-1">Kosongkan jika tidak ingin diubah.</p>
                    </div>
                    <div>
                        <label htmlFor="editPassword" className="block text-sm font-medium mb-2">Password Baru</label>
                        <input
                            type="password"
                            id="editPassword"
                            className="w-full p-3 rounded-lg border border-[#5C8374] bg-[#092635] text-[#9EC8B9] placeholder-[#5C8374] focus:ring-2 focus:ring-[#9EC8B9] focus:border-transparent outline-none"
                            placeholder="Kosongkan jika tidak ingin diubah"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-[#D6FFEF] mt-1">Password baru harus berbeda dari password saat ini.</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#5C8374] text-white py-3 rounded-lg font-semibold hover:bg-[#9EC8B9] hover:text-[#092635] transition-colors duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                    disabled={isLoading}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;