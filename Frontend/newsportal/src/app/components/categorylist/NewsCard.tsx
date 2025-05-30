import { News } from '@/app/types/news';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';
import Image from 'next/image';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link
      href={`/news/${news.id}`}
      className="block group w-full max-w-sm transition-transform transform hover:-translate-y-1"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
        {news.image && (
          <div className="relative w-full h-44 sm:h-48 md:h-52">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {news.title}
            </h3>
            {news.is_trending && (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full mt-1 shrink-0">
                Trending
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            By {news.author?.username || 'Unknown'} • {formatDate(news.published_at)}
          </p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{news.content}</p>
        </div>
      </div>
    </Link>
  );
}
