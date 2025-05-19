from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsCommentAuthorOrStaff
import logging

logger = logging.getLogger(__name__)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Only return top-level comments (parent=None)
        news_id = self.request.query_params.get('news_id')
        if news_id:
            return Comment.objects.filter(news_id=news_id, parent__isnull=True)
        return Comment.objects.filter(parent__isnull=True)

    def perform_create(self, serializer):
        parent_id = self.request.data.get('parent_id')
        parent = None
        if parent_id:
            parent = Comment.objects.get(id=parent_id)
        serializer.save(author=self.request.user, parent=parent)
        parent_info = f" (Reply to {parent.id})" if parent else ""
        logger.info(f"Comment created by {self.request.user.email} on news {serializer.data['news']['title']}: {serializer.data['content']}{parent_info}")

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsCommentAuthorOrStaff]
    lookup_field = 'id'

    def perform_update(self, serializer):
        serializer.save()
        logger.info(f"Comment updated by {self.request.user.email}: {serializer.data['content']}")

    def perform_destroy(self, instance):
        content = instance.content
        author_email = instance.author.email
        news_title = instance.news.title
        super().perform_destroy(instance)
        logger.info(f"Comment deleted by {self.request.user.email} on news {news_title}: {content} (originally by {author_email})")