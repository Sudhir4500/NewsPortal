"use client"; // Client Component for interactivity

import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Search icon from react-icons
import Search from '../features/Search';
import Category from '../categorylist/Category';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          News Portal
        </Link>
        <div className="flex items-center space-x-4">
          {/* <Link href="/" className="hover:underline">
            Home
          </Link> */}
          <Category />
           <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <FaSearch size={20} />
          </button>
          {isAuthenticated ? (
            <>
              {/* <Link href="/profile" className="hover:underline">
                {user?.username}
              </Link> */}
               {user?.is_staff && (
                <Link href="/upload-news" className="hover:underline">
                  Upload News
                </Link>
              )}
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
          {/* Search Icon */}
         
        </div>
      </nav>
      {/* Search Field */}
      <div
        className={`fixed top-24 right-4 w-80 bg-white text-black p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out z-50 ${
          isSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <Search />
      </div>
    </header>
  );
}