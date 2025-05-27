// components/features/Tags.tsx
import Link from 'next/link';
import { Tag } from '@/app/types/news';

interface TagsProps {
  tags: Tag[];
}

export default function Tags({ tags }: TagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tags/${tag.slug}`}
          className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
