import { apiGet } from '@/app/api/api';
import Tags from '@/app/components/features/Tags';
import { News } from '@/app/types/news';
import Link from 'next/link';

interface TagPageProps {
  params: { slug: string };
}

export default async function TagPage({ params }: TagPageProps) {
  let newsItems: News[] = [];
  let tagName: string | null = null;

  try {
    // Fetch tags to get the tag name
    const tags = await apiGet<{ id: string; slug: string; name: string }[]>('/news/tags/');
    console.log('Fetched tags:', JSON.stringify(tags, null, 2));
    console.log('Searching for slug:', params.slug);
    const tag = tags.find((t) => t.slug.toLowerCase() === params.slug.toLowerCase());
    
    if (!tag) {
      console.error(`Tag "${params.slug}" not found in tags list`);
      return (
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
            <p>Tag "{params.slug}" not found.</p>
            <p>Please ensure the tag exists in the backend. You can create it via the admin panel or by adding a news item with this tag.</p>
          </div>
        </div>
      );
    }
    tagName = tag.name;

    // Fetch news items for the tag
    newsItems = await apiGet<News[]>(`/news/?tag=${encodeURIComponent(tag.slug)}`);
    console.log(`Fetched ${newsItems.length} news items for tag: ${tagName}`);
  } catch (error: any) {
    console.error('Failed to fetch news or tag:', error.message);
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p>Failed to load news for tag "{params.slug}".</p>
          <p>Error: {error.message}</p>
          <p>Ensure the backend is running and the tag exists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        News tagged with "#{tagName}"
      </h1>
      {newsItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {news.image && (
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-800">{news.title}</h2>
              <p className="text-sm text-gray-500">{news.category.name}</p>
              <Tags tags={news.tags} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No news found for tag "#{tagName}". Try adding news items with this tag in the backend.
        </p>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const tags = await apiGet<{ id: string; slug: string; name: string }[]>('/news/tags/');
    console.log(`Generating static params for ${tags.length} tags:`, JSON.stringify(tags.map(t => t.slug), null, 2));
    return tags.map((tag) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for tags:', error);
    return [];
  }
}