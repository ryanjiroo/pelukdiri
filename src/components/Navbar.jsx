import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const { currentUserToken, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 flex items-center justify-center py-4 transition-colors duration-300
        ${scrolled ? 'bg-[#1B4242] bg-opacity-95 shadow' : 'bg-transparent shadow-none'}
      `}
    >
        {/*
            Penting: Hapus `px-8` dari `<nav>` utama
            dan tambahkan padding horizontal ke `div` di dalamnya.
        */}
      <div className="flex items-center w-full max-w-5xl justify-between px-4 md:px-8"> {/* Tambahkan px-4 untuk mobile, dan md:px-8 untuk desktop */}
        <div className="text-2xl font-bold text-[#9EC8B9] tracking-wide">
          <Link to="/" className="hover:text-[#5C8374] transition">
            <img
              src="https://raw.githubusercontent.com/ryanjiroo/pelukdiri/refs/heads/main/public/PelukDiri%20Horizontal%20Fit.png"
              alt="PelukDiri Logo"
              className="h-10 md:h-12 lg:h-16"
            />
          </Link>
        </div>

        {/* Hamburger menu button for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-[#9EC8B9] focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8 text-[#9EC8B9] font-medium">
          <li>
            <a href="/" className="hover:text-[#5C8374] cursor-pointer transition">Home</a>
          </li>
          <li>
            <Link to="/artikel" className="hover:text-[#5C8374] cursor-pointer transition">Artikel</Link>
          </li>
          {currentUserToken ? (
            <>
              <li>
                <Link to="/checkin" className="hover:text-[#5C8374] cursor-pointer transition">Checkin</Link>
              </li>
              <li>
                <Link to="/groups" className="hover:text-[#5C8374] cursor-pointer transition">Group</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#5C8374] cursor-pointer transition flex items-center gap-1">
                  {/* SVG Profile Icon */}
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.73 0-5.435-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/checkin" className="hover:text-[#5C8374] cursor-pointer transition">Checkin</Link>
              </li>
              <li>
                <Link to="/groups" className="hover:text-[#5C8374] cursor-pointer transition">Group</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#5C8374] cursor-pointer transition">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#5C8374] cursor-pointer transition">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile menu (shown when isOpen is true) */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1B4242] bg-opacity-95 shadow-md">
          <ul className="flex flex-col items-center py-4 text-[#9EC8B9] font-medium">
            <li>
              <a href="/" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Home</a>
            </li>
            <li>
              <Link to="/artikel" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Artikel</Link>
            </li>
            {currentUserToken ? (
              <>
                <li>
                  <Link to="/checkin" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Checkin</Link>
                </li>
                <li>
                  <Link to="/groups" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Group</Link>
                </li>
                <li>
                  <Link to="/profile" className="block py-2 hover:text-[#5C8374] transition flex items-center justify-center gap-1" onClick={toggleMenu}>
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.73 0-5.435-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/checkin" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Checkin</Link>
                </li>
                <li>
                  <Link to="/groups" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Group</Link>
                </li>
                <li>
                  <Link to="/login" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Login</Link>
                </li>
                <li>
                  <Link to="/register" className="block py-2 hover:text-[#5C8374] transition" onClick={toggleMenu}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
