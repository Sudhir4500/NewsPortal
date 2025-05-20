import NewsCard from './components/features/NewsCard';
import { apiGet } from './api/api';
import { News } from './types/news';
import AdBanner from './components/features/AdBanner';

export default async function Home() {
  const news: News[] = await apiGet<News[]>('/news/');

  return (
    <div className="container mx-auto p-4">
      <AdBanner />
      {/* Main content area */}
      <h1 className="text-3xl font-bold mb-4">News Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );
}