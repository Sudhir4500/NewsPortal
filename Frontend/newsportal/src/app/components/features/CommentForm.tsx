'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/app/api/api';

interface CommentFormProps {
  newsId: string;
  parentId?: string | null;
}

export default function CommentForm({ newsId, parentId = null }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await apiPost('/comments/', {
        content,
        news_id: newsId,
        parent_id: parentId,
      });
      setContent('');
      router.refresh(); // Re-fetch the page to show new comment
    } catch (error: any) {
      console.error('Failed to post comment:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
