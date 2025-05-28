import { apiGet } from '@/app/api/api';
import { News } from './types/news';
import { Category } from './types/news';
import { TrendingNews } from './types/trending';
import NewsCard from './components/features/NewsCard';
import AdBanner from './components/features/AdBanner';
import Carousel from './components/features/Carousel';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryWithNews extends Category {
  news: News[];
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const trendingLimit = 6; // We want exactly 6 trending news
  const categoryLimit = 5;
  const carouselLimit = 5;
  let carouselNews: News[] = [];
  let trendingNews: News[] = [];
  let categories: CategoryWithNews[] = [];

  try {
    // Fetch carousel news
    carouselNews = await apiGet<News[]>(`/news/carousel/?limit=${carouselLimit}`);

    // Fetch trending news IDs - ensure backend respects the limit
    const trendingEntries = await apiGet<TrendingNews[]>(`/news/trending/?limit=${trendingLimit}`);
    
    // Sort by added_at (newest first) and take only the first 6
    const sortedTrendingEntries = trendingEntries
      .sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
      .slice(0, trendingLimit);

    // Fetch full news objects for trending
    trendingNews = await Promise.all(
      sortedTrendingEntries.map(async (entry) => {
        const news = await apiGet<News>(`/news/${entry.news}/`);
        return news;
      })
    );

    // Fetch categories
    const allCategories = await apiGet<Category[]>(`/news/categories/`);

    // Fetch news for each category
    categories = await Promise.all(
      allCategories.map(async (category) => {
        const news = await apiGet<News[]>(`/news/?category=${category.slug}&limit=${categoryLimit}`);
        return { ...category, news };
      })
    );
  } catch (error: any) {
    console.error('Failed to fetch homepage data:', error.message, error);
  }

  // Safely format date for large trending news
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'No Date';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Unknown Date';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Carousel Section */}
      {carouselNews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured News</h2>
          <Carousel initialNews={carouselNews} />
        </section>
      )}

      {/* Ad Banner */}
      <div className="mb-8">
        <AdBanner />
      </div>

      {/* Trending News Section - Now shows exactly 6 news */}
      {trendingNews.length > 0 ? (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trending News</h2>
            <Link
              href="/trending"
              className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
              aria-label="View all trending news"
            >
              Show All
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* First Row: Large News (2 cols) + Small News (1 col) */}
            {trendingNews[0] && (
              <Link
                href={`/news/${trendingNews[0].id}`}
                className="block group lg:col-span-2"
                aria-label={`Read more about ${trendingNews[0].title}`}
              >
                <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
                  {trendingNews[0].image ? (
                    <Image
                      src={trendingNews[0].image}
                      alt={trendingNews[0].title}
                      fill
                      className="object-cover rounded-2xl transition-transform duration-500 ease-in-out group-hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 800px"
                      quality={85}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80 flex flex-col justify-end p-4 sm:p-6 lg:p-8 rounded-2xl">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white drop-shadow-lg line-clamp-2 mb-3">
                      {trendingNews[0].title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-100">
                      <span className="mb-2 sm:mb-0">
                        By {trendingNews[0].author?.username || 'Anonymous'} |{' '}
                        {formatDate(trendingNews[0].published_at)}
                      </span>
                      <span className="bg-blue-700 text-xs px-3 py-1 rounded-full transition-transform duration-300 group-hover:scale-105">
                        {trendingNews[0].category.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {trendingNews[1] && (
              <div className="lg:col-span-1">
                <div className="h-[350px] sm:h-[450px] lg:h-[500px]">
                  <NewsCard news={trendingNews[1]} />
                </div>
              </div>
            )}

            {/* Second Row: Exactly 4 news items (1 on mobile, 4 on desktop) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              {trendingNews.slice(2, 6).map((news) => (
                <div key={news.id} className="h-full">
                  <NewsCard news={news} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="mb-12 bg-yellow-100 text-yellow-700 p-4 rounded-md">
          No trending news available.
        </div>
      )}

      {/* Categories Section */}
      {categories.length > 0 ? (
        categories.map((category) => (
          category.news.length > 0 && (
            <section key={category.id} className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <Link
                  href={`/category/${category.slug}`}
                  className="text-blue-600 font-medium"
                >
                  <h2 className="text-2xl font-bold text-blue-900">{category.name} {'>>'}</h2>
                </Link>
              </div>
              <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                {category.news.map((news) => (
                  <div key={news.id} className="snap-start">
                    <NewsCard news={news} />
                  </div>
                ))}
              </div>
            </section>
          )
        ))
      ) : (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          No categories or news available.
        </div>
      )}
    </main>
  );
}