import { apiGet } from '@/app/api/api';
import { News } from '@/app/types/news';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';

interface RelatedCategoryNewsProps {
  categorySlug: string;
  currentNewsId: string;
}

export default async function RelatedCategoryNews({ categorySlug, currentNewsId }: RelatedCategoryNewsProps) {
  let relatedNews: News[] = [];

  try {
    // Fetch news from the same category, excluding the current news
    relatedNews = await apiGet<News[]>(`/news/?category=${categorySlug}`);
    relatedNews = relatedNews.filter((news) => news.id !== currentNewsId).slice(0, 5); // Limit to 5 items
  } catch (error: any) {
    console.error('Failed to fetch related news:', error.message);
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        Failed to load related news.
      </div>
    );
  }

  if (relatedNews.length === 0) {
    return <p className="text-gray-500 italic">No related news found.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Related News</h3>
      <ul className="space-y-3">
        {relatedNews.map((news) => (
          <li key={news.id} className="flex items-center gap-3">
            {news.image && (
              <img
                src={news.image}
                alt={news.title}
                className="w-12 h-12 object-cover rounded-md"
              />
            )}
            <div>
              <Link
                href={`/news/${news.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                {news.title}
              </Link>
              <p className="text-xs text-gray-500">{formatDate(news.published_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}