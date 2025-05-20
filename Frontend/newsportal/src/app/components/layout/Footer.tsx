"use client"; // Required for potential interactivity (e.g., links)

import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';
import { formatDate } from '@/utils/formatDate';

export default function Footer() {
  const { isAuthenticated, user } = useAuthStore();
  const currentYear = new Date().toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu', year: 'numeric' });

  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <Link href="/" className="text-lg font-semibold hover:underline">
            News Portal
          </Link>
        </div>
        <nav className="flex justify-center space-x-4 mb-4">
          <Link href="/news" className="hover:underline">
            News
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          {/* {isAuthenticated && user && (
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
          )} */}
        </nav>
        <p className="text-sm">
          © {currentYear} News Portal. All rights reserved. Built with ❤️
        </p>
      </div>
    </footer>
  );
}