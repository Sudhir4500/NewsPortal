import { redirect } from 'next/navigation';
import { apiGet } from '@/app/api/api';
import { News } from '@/app/types/news'; // Adjusted import path
import NewsCard from '@/app/components/features/NewsCard';
// import { formatDate } from '@utils/formatDate';

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
      <div className="container mx-auto p-4">
        <p className="text-red-500">No news found in the {params.category} category.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{params.category} News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
        {news.map((item) => (
          <div
            key={item.id}
            className={item.image ? 'lg:col-span-2' : 'lg:col-span-1'}
          >
            <NewsCard news={item} />
          </div>
        ))}
      </div>
    </div>
  );
}