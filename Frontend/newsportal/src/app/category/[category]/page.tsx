// category/[category]/page.tsx
import { redirect } from 'next/navigation';
import { apiGet } from '@/app/api/api';
import { News } from '@/app/types/news';
import NewsCard from '@/app/components/features/NewsCard';

interface CategoryPageProps {
  params: { category: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let news: News[] = [];
  try {
    // Fetch news for the category (assuming backend supports category filtering)
    news = await apiGet<News[]>(`/news/?category=${encodeURIComponent(params.category)}`);
    // Redirect to lowercase category for consistency
    if (params.category.toLowerCase() !== params.category) {
      redirect(`/category/${params.category.toLowerCase()}`);
    }
  } catch (error: any) {
    console.error('Failed to fetch category news:', error.message);
  }

  if (news.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 text-lg font-medium text-center">
          No news found in the {params.category} category.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
        {params.category} News
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex justify-center"
          >
            <NewsCard news={item} />
          </div>
        ))}
      </div>
    </div>
  );
}