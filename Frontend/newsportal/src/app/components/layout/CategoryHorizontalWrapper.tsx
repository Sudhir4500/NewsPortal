"use client";

import { usePathname } from 'next/navigation';
import CategoryHorizontal from '../categorylist/Category';

export default function CategoryHorizontalWrapper() {
  const pathname = usePathname();
  const showCategoryHorizontal = pathname === '/' || pathname.startsWith('/news/');

  return showCategoryHorizontal ? (
    <div className="top-[72px] bg-white z-40">
      <CategoryHorizontal />
    </div>
  ) : null;
}