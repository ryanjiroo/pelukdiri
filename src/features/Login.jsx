import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, currentUserToken } = useAuth();
    const navigate = useNavigate();

    // Redirect jika sudah login
    useEffect(() => { // useEffect sekarang akan dikenali
        if (currentUserToken) {
            navigate('/checkin' || '/profile'); 
        }
    }, [currentUserToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            // Tidak perlu ada logika di sini, karena useEffect sudah menangani navigasi
        }
    };

    return (
        <div className="min-h-screen bg-[#092635] flex items-center justify-center p-4">
            <div className="bg-[#1B4242] rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md">
                {/* Logo/Nama Aplikasi */}
                <div className="flex justify-center mb-6">
                    <span className="text-4xl font-extrabold text-[#9EC8B9] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#9EC8B9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        PelukDiri
                    </span>
                </div>

                {/* Judul Login */}
                <h2 className="text-2xl font-bold text-[#9EC8B9] text-center mb-2">
                    Login dengan Username
                </h2>
                <p className="text-[#D6FFEF] text-center mb-8">
                    Silakan masukkan detail Anda untuk masuk.
                </p>

                {/* Formulir Login */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[#9EC8B9] mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg fill="#5C8374" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#5C8374" width="24" height="24">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M12,1a11,11,0,0,0,0,22,1,1,0,0,0,0-2,9,9,0,1,1,9-9v2.857a1.857,1.857,0,0,1-3.714,0V7.714a1,1,0,1,0-2,0v.179A5.234,5.234,0,0,0,12,6.714a5.286,5.286,0,1,0,3.465,9.245A3.847,3.847,0,0,0,23,14.857V12A11.013,11.013,0,0,0,12,1Zm0,14.286A3.286,3.286,0,1,1,15.286,12,3.29,3.29,0,0,1,12,15.286Z"></path>
                                    </g>
                                </svg>
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="pl-10 pr-3 py-3 w-full rounded-lg border border-[#5C8374] bg-[#092635] text-[#9EC8B9] placeholder-[#5C8374] focus:outline-none focus:ring-2 focus:ring-[#9EC8B9] focus:border-transparent"
                                placeholder="Username Anda"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#9EC8B9] mb-2">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-[#5C8374]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="pl-10 pr-10 py-3 w-full rounded-lg border border-[#5C8374] bg-[#092635] text-[#9EC8B9] placeholder-[#5C8374] focus:outline-none focus:ring-2 focus:ring-[#9EC8B9] focus:border-transparent"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <svg className="h-5 w-5 text-[#5C8374]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414L5.586 8H4a1 1 0 000 2h1.586l-2.293 2.293a1 1 0 001.414 1.414L8 11.414V13a1 1 0 002 0v-1.586l2.293 2.293a1 1 0 001.414-1.414L11.414 10H13a1 1 0 000-2h-1.586l2.293-2.293a1 1 0 00-1.414-1.414L10 6.586V5a1 1 0 00-2 0v1.586L3.707 2.293zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                ) : (
                                    <svg className="h-5 w-5 text-[#5C8374]" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end text-sm">
                        <a href="#" className="font-medium text-[#5C8374] hover:text-[#9EC8B9]">
                            Lupa Kata Sandi?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#5C8374] text-white py-3 rounded-lg font-semibold hover:bg-[#9EC8B9] hover:text-[#092635] transition-colors duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Memuat...' : 'Login'}
                    </button>
                </form>

                <p className="mt-8 text-xs text-[#D6FFEF] text-center">
                    Dengan melanjutkan, Anda menyetujui <a href="#" className="font-medium text-[#5C8374] hover:text-[#9EC8B9]">Ketentuan Layanan</a> kami dan mengakui <a href="#" className="font-medium text-[#5C8374] hover:text-[#9EC8B9]">Kebijakan Privasi</a> kami.
                </p>

                <p className="mt-4 text-sm text-[#D6FFEF] text-center">
                    Belum punya akun?{' '}
                    <Link to="/register" className="font-medium text-[#5C8374] hover:text-[#9EC8B9]">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
