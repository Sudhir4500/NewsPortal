import { Comment } from "@/app/types/comments";
import { formatDate } from "@/utils/formatDate";

interface CommentTreeProps {
  comment: Comment;
}

const CommentTree: React.FC<CommentTreeProps> = ({ comment }) => {
  return (
    <div className="border-l-2 pl-4 my-4" style={{ marginLeft: comment.parent_id ? '20px' : '0' }}>
      <p className="text-gray-800">{comment.content}</p>
      <p className="text-sm text-gray-500">
        By {comment.author.username} on {formatDate(comment.created_at)}
      </p>
      {comment.replies.map((reply) => (
        <CommentTree key={reply.id} comment={reply} />
      ))}
    </div>
  );
};

export default CommentTree;