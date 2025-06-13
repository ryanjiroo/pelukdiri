// src/components/LoadingScreen.jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './LoadingScreen.css';

function LoadingScreen({ progress }) { // Menerima prop 'progress'
  return (
    <div className="loading-screen-container">
      <DotLottieReact
        src="https://lottie.host/032fe333-ea4b-4591-b995-aee6e9066922/tcJ1pa4ZpP.lottie"
        autoplay
        loop
        style={{ width: '200px', height: '200px' }}
      />
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{Math.round(progress)}%</p> {/* Menampilkan persentase */}
    </div>
  );
}

export default LoadingScreen;