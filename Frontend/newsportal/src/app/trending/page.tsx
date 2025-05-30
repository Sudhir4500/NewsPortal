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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Trending News
        </h1>
       
      </div>

      {trendingNews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {trendingNews.map((news) => (
            <div key={news.id} className="flex justify-center">
              <NewsCard news={news} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10 text-lg italic">
          No trending news available at the moment.
        </div>
      )}
    </div>
  );
}
