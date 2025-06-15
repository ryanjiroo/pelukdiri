import React from 'react';

const Footer = () => {

    return (
        <footer className="w-full py-8 bg-[#1B4242] text-[#9EC8B9]">
            {/* Menggunakan grid untuk tata letak utama, dengan penyesuaian untuk distribusi yang lebih merata */}
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0 lg:gap-x-4">
                {/* Kolom 1: Informasi Branding/Hak Cipta */}
                {/* Menambahkan flex-grow-1 untuk memastikan kolom ini mengambil ruang yang proporsional */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-grow">
                    <img
                        src="https://raw.githubusercontent.com/ryanjiroo/pelukdiri/refs/heads/main/public/PelukDiri%20Horizontal%20Fit.png"
                        alt="PelukDiri Logo"
                        className="h-10 md:h-12 lg:h-16 mb-4 flex-shrink-0"
                    />
                    <p>&copy; {new Date().getFullYear()} PelukDiri. All rights reserved.</p>
                    <p className="mt-1 text-sm opacity-80">Membantu Anda menemukan kedamaian batin.</p>
                </div>

                {/* Kolom 2: Tautan Cepat */}
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="font-semibold text-lg mb-3">Tautan Cepat</h3>
                    <ul className="space-y-2 text-center md:text-left">
                        <li><a href="#home" className="hover:text-white transition-colors">Beranda</a></li>
                        <li><a href="#about" className="hover:text-white transition-colors">Tentang Kami</a></li>
                        <li><a href="#services" className="hover:text-white transition-colors">Layanan</a></li>
                        <li><a href="#contact" className="hover:text-white transition-colors">Kontak</a></li>
                    </ul>
                </div>

                {/* Kolom 3: Media Sosial */}
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="font-semibold text-lg mb-3">Ikuti Kami</h3>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com/pelukdiri" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.084 3.737 9.319 8.618 10.07V14.125h-2.348v-2.13H10.27V9.728c0-2.327 1.42-3.592 3.498-3.592 1.002 0 1.868.074 2.115.107v2.443h-1.458c-1.144 0-1.371.545-1.371 1.34V12h2.89l-.47 2.125h-2.42V22.07C18.263 21.319 22 17.084 22 12c0-5.523-4.477-10-10-10z" /></svg>
                        </a>
                        <a href="https://instagram.com/pelukdiri" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M7.5 2C4.467 2 2 4.467 2 7.5v9C2 19.533 4.467 22 7.5 22h9c3.033 0 5.5-2.467 5.5-5.5v-9C22 4.467 19.533 2 16.5 2h-9zM7.5 3.5h9c2.215 0 4 1.785 4 4v9c0 2.215-1.785 4-4 4h-9c-2.215 0-4-1.785-4-4v-9c0-2.215 1.785-4 4-4zM16.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 8.5c-2.481 0-4.5 2.019-4.5 4.5s2.019 4.5 4.5 4.5 4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5zm0 1.5c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" /></svg>
                        </a>
                    </div>
                </div>

                {/* Kolom 4: Informasi Kontak (Opsional) */}
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="font-semibold text-lg mb-3">Hubungi Kami</h3>
                    <ul className="space-y-2 text-center md:text-left">
                        <li>Email: <a href="mailto:info@pelukdiri.com" className="hover:text-white transition-colors">info@pelukdiri.com</a></li>
                        <li>Telepon: <a href="tel:+628123456789" className="hover:text-white transition-colors">+62 812 3456 789</a></li>
                        <li>Alamat: Jakarta, Indonesia</li>
                    </ul>
                </div>
            </div>
            {/* Bagian bawah footer */}
            <div className="mt-8 pt-4 border-t border-[#9EC8B9] border-opacity-20 text-center text-sm opacity-70">
                Selalu ada ruang, waktu, dan kata untukmu yang ingin didengar.
            </div>
        </footer>
    );
}

export default Footer;
