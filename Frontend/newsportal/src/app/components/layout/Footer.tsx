'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
// import { apiGet } from '@/app/api/api';
// import { Category } from '@/app/types/news';

export default function Footer() {
  const { isAuthenticated, user } = useAuthStore();
  const currentYear = new Date().toLocaleString('en-NP', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
  });

  // const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const data = await apiGet<Category[]>('/news/categories/');
  //       setCategories(data);
  //     } catch (err: any) {
  //       console.error('Failed to fetch categories:', err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
            Rolpa Online
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            Your daily dose of trusted information.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Link href="/news" className="hover:text-blue-400 transition">
            News
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>
          {/* {isAuthenticated && user && (
            <Link href="/profile" className="hover:text-blue-400 transition">
              Profile
            </Link>
          )} */}
        </div>

        {/* Categories */}
        {/* {!loading && categories.length > 0 && (
          <div className="text-center mb-6">
            <h3 className="text-md font-semibold text-gray-300 mb-2">Categories</h3> */}
            {/* <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-sm text-blue-300 hover:text-blue-100 transition"
                >
                  {category.name}
                </Link>
              ))}
            </div> */}
        {/* )} */}

        {/* Footer Bottom */}
        <div className="text-center text-sm text-gray-500">
          <p>© {currentYear} Rolpa Online. All rights reserved.</p>
          <p>
            Built with <span className="text-red-400">❤️</span> in Kathmandu.
          </p>
        </div>
      </div>
    </footer>
  );
}
