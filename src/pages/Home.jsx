import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Leaf = ({ left, delay }) => (
  <div
    className="absolute top-0"
    style={{
      left: `${left}%`,
      animation: `fall 6s linear infinite`,
      animationDelay: `${delay}s`,
      zIndex: 0,
    }}
  >
    <span style={{ fontSize: 32, opacity: 0.7 }}>🍃</span>
  </div>
);

const Home = () => {
  const [hover, setHover] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen text-center p-6 overflow-hidden relative">
      {/* Animasi daun jatuh */}
      <Leaf left={10} delay={0} />
      <Leaf left={30} delay={2} />
      <Leaf left={60} delay={3} />
      <Leaf left={80} delay={1} />
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
        <Link to="/checkin"> {/* Bungkus tombol dengan Link */}
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
      {/* Animasi CSS */}
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
          @keyframes fall {
            0% {
              top: -40px;
              opacity: 0.7;
              transform: rotate(-10deg) scale(1);
            }
            80% {
              opacity: 0.7;
              transform: rotate(10deg) scale(1.1);
            }
            100% {
              top: 100vh;
              opacity: 0;
              transform: rotate(20deg) scale(0.9);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Home;