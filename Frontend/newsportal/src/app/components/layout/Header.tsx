'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Search from '../features/Search';
import AuthMenu from '../features/AuthMenu';
import { useAuthStore } from '@/app/stores/authStore';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            News Portal
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated && user?.is_staff && (
              <Link
                href="/upload-news"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition"
              >
                Upload News
              </Link>
            )}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-gray-300 focus:outline-none cursor-pointer"
            >
              <FaSearch size={20} />
            </button>
            <AuthMenu />
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
    </>
  );
}
