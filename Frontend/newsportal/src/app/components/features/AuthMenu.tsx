'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa'; // user head icon

export default function AuthMenu() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsDropdownOpen(false);
  };

  const initial = user?.username ? user.username[0].toUpperCase() : '?';

  return (
    <div className="relative " ref={menuRef}>
      <button
        onClick={toggleDropdown}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer"
        title={isAuthenticated ? user?.username : 'Account'}
      >
        {isAuthenticated ? (
          initial
        ) : (
          <FaUserCircle size={24} className="text-white" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 cursor-pointer">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800 cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
