import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image for optimized loading
import { News } from '@/app/types/news';
import { formatDate } from '@/utils/formatDate';
interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className={`border rounded-lg p-4 shadow-md ${news.image ? 'has-image' : ''}`}>
      <Link href={`/news/${news.id}`}>
        {news.image && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={news.image}
              alt={news.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              priority={false} // Optional: Set to true for above-the-fold images
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
        <p className="text-gray-600 mb-2">{news.content.slice(0, 100)}...</p>
      </Link>
      <p className="text-sm text-gray-500">
        By {news.author.username} on {formatDate(news.published_at)}
      </p>
    </div>
  );
}