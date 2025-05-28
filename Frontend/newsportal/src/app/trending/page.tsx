// trending/page.tsx
import { apiGet } from '@/app/api/api';
import { News } from '@/app/types/news';
import { TrendingNews } from '@/app/types/trending';
import NewsCard from '@/app/components/features/NewsCard';

export default async function TrendingPage() {
  let trendingNews: News[] = [];

  try {
    // Fetch trending news IDs
    const trendingEntries = await apiGet<TrendingNews[]>('/news/trending/');
    
    // Fetch full news objects for trending
    trendingNews = await Promise.all(
      trendingEntries.map(async (entry) => {
        const news = await apiGet<News>(`/news/${entry.news}/`);
        return news;
      })
    );
  } catch (error: any) {
    console.error('Failed to fetch trending news:', error.message);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Trending News</h1>
      {trendingNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No trending news available.</p>
      )}
    </div>
  );
}