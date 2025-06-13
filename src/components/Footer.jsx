import React from 'react';

const Footer = () => {

    return (
        <footer className="w-full py-8 bg-[#1B4242] text-[#9EC8B9]">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                {/* Kolom 1: Informasi Branding/Hak Cipta */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-2xl font-bold text-[#9EC8B9] tracking-wide">PelukDiri</span>
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
                        <a href="https://twitter.com/pelukdiri" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white transition-colors">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.054 5.03c-.66.294-1.365.492-2.106.582.76-.456 1.344-1.18 1.62-2.046-.71.424-1.49.734-2.316.903-.674-.72-1.63-1.168-2.697-1.168-2.044 0-3.704 1.66-3.704 3.704 0 .29.032.57.094.832-3.08-.155-5.807-1.628-7.633-3.86-.32.55-.504 1.18-.504 1.854 0 1.286.65 2.423 1.637 3.09-.604-.018-1.173-.186-1.667-.46v.047c0 1.794 1.278 3.29 2.973 3.633-.31.084-.638.128-.976.128-.24 0-.472-.023-.698-.067.47.474 1.14.82 1.897.943C5.772 17.03 3.7 17.842 2.05 17.842c-.34 0-.67-.02-.99-.058C2.962 18.064 4.816 18.5 6.643 18.5c7.974 0 12.336-6.608 12.336-12.337 0-.188-.004-.374-.012-.56.848-.616 1.588-1.38 2.172-2.257z" /></svg>
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
            <div className="mt-8 pt-4 border-t border-[#9EC8B9] border-opacity-20 text-center text-sm opacity-70">
                Selalu ada ruang, waktu, dan kata untukmu yang ingin didengar.
            </div>
        </footer>
    );
}

export default Footer;