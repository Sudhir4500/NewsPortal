'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/app/api/api';

interface Category {
  slug: string;
  name: string;
}

export default function CategoryHorizontal() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiGet<Category[]>('/news/categories/');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full overflow-x-auto bg-white shadow-md rounded-b-lg ">
      <div className="flex space-x-3 px-4 py-3 whitespace-nowrap">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => router.push(`/category/${cat.slug}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
