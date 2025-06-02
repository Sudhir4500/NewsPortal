import { News } from '@/app/types/news';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';
import Image from 'next/image';

interface NewsCardProps {
  news: News;
  variant?: 'grid' | 'scroll';
}

export default function NewsCard({ news, variant = 'grid' }: NewsCardProps) {
  
  const cardWidth = variant === 'scroll' ? 'min-w-[280px] max-w-[320px]' : 'w-full';

  return (
    <Link
      href={`/news/${news.id}`}
      className={`block group ${cardWidth} h-[350px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
    >
      {/* Image or Fallback */}
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-[calc(100%-10rem)]">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            {news.title}
          </h3>
          {news.is_trending && (
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
              Trending
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 font-medium leading-tight">
          By {news.author?.username || 'Unknown Author'} • {formatDate(news.published_at)}
        </p>

        <p className="text-sm text-gray-600 mt-1 line-clamp-3 leading-relaxed">
          {news.content || 'Read full article...'}
        </p>
      </div>
    </Link>
  );
}
