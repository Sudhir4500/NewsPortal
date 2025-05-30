import { News } from '@/app/types/news';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';
import Image from 'next/image';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.id}`} className="block group min-w-[280px] max-w-[320px]">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
        {news.image && (
          <div className="relative w-full h-40">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
              {news.title}
            </h3>
            {news.is_trending && (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0">
                Trending
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            By {news.author?.username || 'Unknown Author'} • {formatDate(news.published_at)}
          </p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">{news.content}</p>
        </div>
      </div>
    </Link>
  );
}