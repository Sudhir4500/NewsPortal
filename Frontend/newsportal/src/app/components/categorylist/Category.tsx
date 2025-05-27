'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/app/api/api';

interface Category {
  slug: string;
  name: string;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await apiGet<Category[]>('/news/categories/');
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (slug: string) => {
    setIsDropdownOpen(false); // Close dropdown on category selection
    router.push(`/category/${slug}`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading categories...</div>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        onMouseEnter={() => setIsDropdownOpen(true)}
        className="flex items-center bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded transition duration-200"
      >
        Categories
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg transition-all duration-200 z-10 ${
          isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}