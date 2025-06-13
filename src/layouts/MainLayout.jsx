// MainLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-[#092635] flex flex-col font-sans text-base"> {/* Hapus min-w-screen di sini */}
    <Navbar />
    <main className="flex-1 flex flex-col">
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;