import { apiGet } from '@/app/api/api';
import { News } from '@/app/types/news';
import { Comment } from '@/app/types/comments';
import CommentTree from '@/app/components/features/CommentTree';
import AuthenticatedCommentForm from '@/app/components/features/AuthenticatedCommentForm';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link'; // ✅ Import Link

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
      <div className="container mx-auto p-4">
        <p className="text-red-500">
          Failed to load news or comments. Ensure the backend is running.
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">News post not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

      <p className="whitespace-pre-wrap text-gray-600 mb-2">{news.content}</p>

      <p className="text-sm text-gray-500 mb-4">
        By {news.author.username} on {formatDate(news.published_at)} |{' '}
        <Link
          href={`/category/${news.category.slug}`}
          className="text-blue-500 hover:underline"
        >
          {news.category.name}
        </Link>
      </p>

      {news.image && (
        <img src={news.image} alt={news.title} className="w-full h-auto mb-4 rounded-lg" />
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Comments</h2>

        <AuthenticatedCommentForm newsId={news.id} />

        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentTree key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
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
