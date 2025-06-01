// src/app/components/VirtualizedCategory.tsx
"use client";

import { News, Category } from '@/app/types/news';
import NewsCard from '../features/NewsCard';
import Link from 'next/link';
import { VirtuosoGrid } from 'react-virtuoso';
import styled from 'styled-components';

interface CategoryWithNews extends Category {
  news: News[];
}

interface VirtualizedCategoryProps {
  category: CategoryWithNews;
}
// virtuoso is a library for rendering large lists and grids efficiently
// It uses virtualization to only render items that are currently visible in the viewport, that means it can handle large datasets without performance issues.and it is particularly useful for displaying lists or grids of items, such as news articles, where only a subset of the total items is visible at any given time.

// Styled container for VirtuosoGrid
const GridContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(250px, 1fr);
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-snap-type: x mandatory;
`;

const GridContainerWithRef = styled(GridContainer)`
  width: 100%;
`;

const VirtualizedCategory = ({ category }: VirtualizedCategoryProps) => {
  if (!category.news.length) return null;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <Link href={`/category/${category.slug}`} className="text-blue-600 font-medium">
          <h2 className="text-2xl font-bold text-blue-900">{category.name} {'>>'}</h2>
        </Link>
      </div>
      <VirtuosoGrid
        totalCount={category.news.length}
        data={category.news}
        overscan={200}
        itemContent={(index, news: News) => (
          <div key={news.id} className="snap-start">
            <NewsCard news={news} />
          </div>
        )}
        components={{ List: GridContainerWithRef }}
        style={{ height: '300px', width: '100%' }}
      />
    </section>
  );
};

export default VirtualizedCategory;