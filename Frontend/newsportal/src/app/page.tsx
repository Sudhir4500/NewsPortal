import NewsCard from './components/features/NewsCard';
import { apiGet } from './api/api';
import { News } from './types/news';
import AdBanner from './components/features/AdBanner';

export default async function Home() {
  const news: News[] = await apiGet<News[]>('/news/');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Ad Banner */}
      <div className="mb-8">
        <AdBanner />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome to the News Portal
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Get the latest updates across categories, curated for you.
        </p>
      </div>

      {/* News Grid */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
