import { apiGet } from '@/app/api/api';
import { News } from '@/app/types/news';
import { Comment } from '@/app/types/comments';
import CommentTree from '@/app/components/features/CommentTree';
import AuthenticatedCommentForm from '@/app/components/features/AuthenticatedCommentForm';
import RelatedCategoryNews from '@/app/components/features/RelatedCategoryNews'; // Import the new component
import Tags from '@/app/components/features/Tags';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';

interface NewsDetailPageProps {
  params: { id: string }; // UUID
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  let news: News | null = null;
  let comments: Comment[] = [];

  try {
    news = await apiGet<News>(`/news/${params.id}/`);
    comments = await apiGet<Comment[]>(`/comments/?news_id=${params.id}`);
  } catch (error: any) {
    console.error('Failed to fetch news or comments:', error.message);
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Failed to load news or comments. Ensure the backend is running.
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          News post not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="lg:w-2/3 space-y-6">
        <article className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">{news.title}</h1>

          {news.image && (
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          )}

          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>By <span className="font-medium text-gray-700">{news.author.username}</span></span>
            <span>•</span>
            <span>{formatDate(news.published_at)}</span>
            <span>•</span>
            <Link
              href={`/category/${news.category.slug}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {news.category.name}
            </Link>
          </div>

          <Tags tags={news.tags} />

          <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
            {news.content}
          </p>
        </article>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>

          <div className="mb-6">
            <AuthenticatedCommentForm newsId={news.id} />
          </div>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentTree key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
          )}
        </section>
      </div>

      {/* Sidebar for related news */}
      <aside className="lg:w-1/3">
        <RelatedCategoryNews categorySlug={news.category.slug} currentNewsId={news.id} />
      </aside>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const newsItems: News[] = await apiGet<News[]>('/news/');
    return newsItems.map((news) => ({
      id: news.id,
    }));
  } catch (error) {
    console.error('Failed to generate static params for news:', error);
    return [];
  }
}