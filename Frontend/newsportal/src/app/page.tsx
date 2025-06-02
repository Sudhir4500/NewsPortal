import { apiGet } from '@/app/api/api';
import { News } from './types/news';
import { Category } from './types/news';
import { TrendingNews } from './types/trending';
import NewsCard from './components/features/NewsCard';
import AdBanner from './components/features/AdBanner';
import Carousel from './components/features/Carousel';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import HomeSkeleton from './components/loading/HomeSkeleton';

interface CategoryWithNews extends Category {
  news: News[];
}

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function HomeContent({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const trendingLimit = 6;
  const categoryLimit = 5;
  const carouselLimit = 5;
  let carouselNews: News[] = [];
  let trendingNews: News[] = [];
  let categories: CategoryWithNews[] = [];

  try {
    carouselNews = await apiGet<News[]>(`/news/carousel/?limit=${carouselLimit}`);
    const trendingEntries = await apiGet<TrendingNews[]>(`/news/trending/?limit=${trendingLimit}`);
    const sortedTrendingEntries = trendingEntries
      .sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
      .slice(0, trendingLimit);
    trendingNews = await Promise.all(
      sortedTrendingEntries.map(async (entry) => {
        const news = await apiGet<News>(`/news/${entry.news}/`);
        return news;
      })
    );
    const allCategories = await apiGet<Category[]>(`/news/categories/`);
    categories = await Promise.all(
      allCategories.map(async (category) => {
        const news = await apiGet<News[]>(`/news/?category=${category.slug}&limit=${categoryLimit}`);
        return { ...category, news };
      })
    );
  } catch (error: any) {
    console.error('Failed to fetch homepage data:', error.message, error);
  }

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
      {carouselNews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured News</h2>
          <Carousel initialNews={carouselNews} />
        </section>
      )}

      <div className="mb-8">
        <AdBanner />
      </div>

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
            {trendingNews[0] && (
              <Link
                href={`/news/${trendingNews[0].id}`}
                className="block group lg:col-span-2"
              >
                <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl">
                  {trendingNews[0].image ? (
                    <Image
                      src={trendingNews[0].image}
                      alt={trendingNews[0].title}
                      fill
                      className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 800px"
                      quality={85}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white drop-shadow line-clamp-2 mb-3">
                      {trendingNews[0].title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-100">
                      <span>
                        By {trendingNews[0].author?.username || 'Anonymous'} | {formatDate(trendingNews[0].published_at)}
                      </span>
                      <span className="bg-blue-700 text-xs px-3 py-1 rounded-full">
                        {trendingNews[0].category.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {trendingNews[1] && (
              <div className="lg:col-span-1">
                <Link
                  href={`/news/${trendingNews[1].id}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
                >
                  {trendingNews[1].image ? (
                    <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-80">
                      <Image
                        src={trendingNews[1].image}
                        alt={trendingNews[1].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 300px"
                        quality={85}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 sm:h-72 md:h-80 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                      {trendingNews[1].title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {trendingNews[1].content || 'No content provided. Stay tuned for more details.'}
                    </p>
                    <div className="text-xs text-gray-500 mt-3 flex justify-between">
                      <span>{trendingNews[1].author?.username || 'Anonymous'}</span>
                      <span>{formatDate(trendingNews[1].published_at)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-3">
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
                    <NewsCard news={news} variant='scroll' />
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

export default async function Home({ searchParams }: HomePageProps) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}