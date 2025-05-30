'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { apiDelete } from '@/app/api/api';
import { Comment } from '@/app/types/comments';
import { formatDate } from '@/utils/formatDate';

interface CommentTreeProps {
  comment: Comment;
}

const CommentTree: React.FC<CommentTreeProps> = ({ comment }) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);
    try {
      await apiDelete(`/comments/${comment.id}/`);
      router.refresh(); // Refresh the page to update the comment list
    } catch (error: any) {
      console.error('Failed to delete comment:', error.message);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border-l-2 pl-4 my-4" style={{ marginLeft: comment.parent_id ? '20px' : '0' }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-800">{comment.content}</p>
          <p className="text-sm text-gray-500">
            By {comment.author.username} on {formatDate(comment.created_at)}
          </p>
        </div>
        {isAuthenticated && (user?.is_staff || user?.id === comment.author.id) && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
      {comment.replies.map((reply) => (
        <CommentTree key={reply.id} comment={reply} />
      ))}
    </div>
  );
};

export default CommentTree;