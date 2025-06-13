import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Komponen untuk setiap tetesan hujan
const Raindrop = ({ left, delay, duration, size, opacity }) => (
  <div
    className="raindrop"
    style={{
      left: `${left}vw`,
      // Penting: Pastikan animasi dimulai dari posisi yang benar-benar tidak terlihat
      animation: `rain ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      width: `${size}px`,
      height: `${size * 2}px`,
      opacity: opacity,
      zIndex: 1,
      // Tambahan: Pastikan tetesan tidak terlihat sebelum animasinya aktif
      // Ini akan membuat tetesan muncul dari atas setelah delay
      top: `-100vh`, // Mulai jauh di atas viewport secara default
    }}
  ></div>
);

const Home = () => {
  const [hover, setHover] = useState(false);
  const [showRain, setShowRain] = useState(false); // State untuk mengontrol kapan hujan ditampilkan

  useEffect(() => {
    // Memulai menampilkan hujan setelah 3 detik
    // Kita bisa mengatur penundaan sedikit lebih lama dari delay terlama pada raindrop
    const initialRainDelay = 3000; // Penundaan awal sebelum tetesan mulai dirender
    const maxRaindropDelay = 5000; // Penundaan maksimum yang diberikan ke raindrop (5 detik di getRandom)

    // Mulai render tetesan setelah initialRainDelay
    const timer = setTimeout(() => {
      setShowRain(true);
    }, initialRainDelay);

    // Membersihkan timer saat komponen di-unmount
    return () => clearTimeout(timer);
  }, []);

  const getRandom = (min, max) => Math.random() * (max - min) + min;

  const raindrops = Array.from({ length: 70 }).map((_, index) => ({
    id: index,
    left: getRandom(0, 100),
    delay: getRandom(0, 5), // Penundaan acak dari 0-5 detik
    duration: getRandom(2, 5), // Durasi animasi acak dari 2-5 detik
    size: getRandom(1, 3),
    opacity: getRandom(0.4, 0.8),
  }));

  return (
    <div className="flex items-center justify-center min-h-screen text-center p-6 overflow-hidden relative bg-[#092635]">
      {/* Animasi Hujan: hanya ditampilkan jika showRain bernilai true */}
      {showRain && raindrops.map(drop => (
        <Raindrop
          key={drop.id}
          left={drop.left}
          delay={drop.delay}
          duration={drop.duration}
          size={drop.size}
          opacity={drop.opacity}
        />
      ))}

      {/* Konten Utama Halaman */}
      <div className="w-full max-w-2xl relative z-10">
        <h1
          className="text-5xl font-bold text-[#9EC8B9] mb-4 animate-fade-in-down"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          Peluk Diri, Pulang ke Hati
        </h1>
        <p
          className="text-xl text-[#5C8374] max-w-xl mx-auto mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          Beri pelukan kepada dirimu, dalam riuh dunia dan sunyi pikiran. Di sini isi hati, tangisan, dan ceritamu akan didengar.
        </p>
        <Link to="/checkin">
          <button
            className="py-2 px-4 rounded-[18px] transition duration-300 animate-fade-in"
            style={{
              animationDelay: '1s',
              animationFillMode: 'both',
              backgroundColor: hover ? '#1B4242' : '#5C8374',
              color: hover ? '#9EC8B9' : '#092635',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Pulihkan Dirimu
          </button>
        </Link>
      </div>

      {/* Definisi Animasi CSS */}
      <style>
        {`
          @keyframes fade-in-down {
            0% {
              opacity: 0;
              transform: translateY(-40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fade-in-down {
            animation: fade-in-down 1s cubic-bezier(0.4,0,0.2,1) both;
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s cubic-bezier(0.4,0,0.2,1) both;
          }
          .animate-fade-in {
            animation: fade-in 1s cubic-bezier(0.4,0,0.2,1) both;
          }

          @keyframes rain {
            0% {
              top: -20%; /* Mulai sedikit di atas viewport, ini adalah dari keyframe */
            }
            100% {
              top: 120%; /* Jatuh jauh di bawah viewport */
            }
          }

          .raindrop {
            position: absolute;
            background-color: #9EC8B9;
            border-radius: 2px;
            /* Tambahan: Pastikan ini benar-benar tidak terlihat sampai animationDelay berlalu */
            /* Ini akan di-override oleh keyframe begitu animasi dimulai */
          }
        `}
      </style>
    </div>
  );
};

export default Home;
