import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import TentangKami from './pages/TentangKami';
import Layanan from './pages/Layanan';
import Artikel from './pages/Artikel';
import Baca from './pages/Baca';
import Login from './features/Login';
import Register from './features/Register';
import Checkin from './features/Checkin';
import Profile from './pages/Profile';
import GroupCircle from './features/GroupCircle'; 

import Chatbot from './features/Chatbot';
import LoadingScreen from './components/LoadingScreen'; // Import komponen LoadingScreen

function App() {
  // Gunakan state untuk mengontrol loading hanya untuk initial mount
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Periksa apakah aplikasi sudah pernah dimuat dalam sesi ini
    // Ini adalah cara untuk mencegah loading screen muncul lagi setelah navigasi
    const hasAppLoadedBefore = sessionStorage.getItem('hasAppLoaded');

    if (hasAppLoadedBefore) {
      setIsLoadingApp(false);
      return; // Langsung keluar jika sudah pernah dimuat
    }

    const initializeApp = async () => {
      let currentProgress = 0;
      const totalSteps = 10;
      const delayPerStep = 300; // Total loading time will be totalSteps * delayPerStep (e.g., 10 * 300ms = 3 detik)

      // Simulasi progress loading
      for (let i = 0; i <= totalSteps; i++) {
        currentProgress = (i / totalSteps) * 100;
        setLoadingProgress(currentProgress);
        await new Promise(resolve => setTimeout(resolve, delayPerStep));
      }

      try {
        // --- LOGIKA INISIALISASI APLIKASI NYATA DI SINI ---
        // Contoh: Ambil data user, konfigurasi, dll.
        // await fetchData('/api/initial-data');
        // await checkUserAuthentication();
        // ----------------------------------------------------

      } catch (error) {
        console.error("Gagal menginisialisasi aplikasi:", error);
      } finally {
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500)); // Sedikit jeda setelah 100%

        setIsLoadingApp(false);
        // Set flag di sessionStorage setelah aplikasi berhasil dimuat
        sessionStorage.setItem('hasAppLoaded', 'true');
      }
    };

    initializeApp();
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat komponen di-mount

  // Jika isLoadingApp masih true, tampilkan LoadingScreen
  if (isLoadingApp) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  // Jika tidak, render aplikasi utama
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <TentangKami />
                  <Layanan />
                </>
              }
            />

            <Route path="/artikel" element={<Artikel />} />
            <Route path="/artikel/:articleId" element={<Baca />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/checkin" element={<Checkin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/groups" element={<GroupCircle />} />
          </Routes>

          <Chatbot />
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;