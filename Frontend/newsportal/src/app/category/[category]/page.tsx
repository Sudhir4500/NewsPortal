// category/[category]/page.tsx
import { redirect } from 'next/navigation';
import { apiGet } from '@/app/api/api';
import { News } from '@/app/types/news';
import NewsCard from '@/app/components/categorylist/NewsCard';

// Define the props interface with params as a Promise
interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params to resolve the dynamic route parameter
  const { category } = await params;

  let news: News[] = [];
  try {
    // Fetch news for the category
    news = await apiGet<News[]>(`/news/?category=${encodeURIComponent(category)}`);
    // Redirect to lowercase category for consistency
    if (category.toLowerCase() !== category) {
      redirect(`/category/${category.toLowerCase()}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch category news:', error.message);
  }

  if (news.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 text-lg font-medium text-center">
          No news found in the {category} category.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
        {category} News
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {news.map((item) => (
          <div key={item.id} className="flex justify-center">
            <NewsCard news={item} />
          </div>
        ))}
      </div>
    </div>
  );
}