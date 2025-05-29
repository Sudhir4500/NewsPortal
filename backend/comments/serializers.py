from rest_framework import serializers
from .models import Comment
from accounts.serializers import UserSerializer
from news.models import News

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['id', 'title', 'slug']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    news = NewsSerializer(read_only=True)
    news_id = serializers.UUIDField(write_only=True)
    parent_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'news', 'news_id', 'author', 'content', 'parent_id', 'replies', 'created_at', 'updated_at']

    def get_replies(self, obj):
        # Recursively serialize replies
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data

    def validate_news_id(self, value):
        if not News.objects.filter(id=value).exists():
            raise serializers.ValidationError("News with this ID does not exist.")
        return value

    def validate_parent_id(self, value):
        if value is None:
            return value
        if not Comment.objects.filter(id=value).exists():
            raise serializers.ValidationError("Parent comment with this ID does not exist.")
        return value

    def validate(self, data):
        # Ensure parent_id, if provided, belongs to the same news post
        if 'parent_id' in data and data['parent_id']:
            parent_comment = Comment.objects.get(id=data['parent_id'])
            if parent_comment.news_id != data['news_id']:
                raise serializers.ValidationError("Parent comment must belong to the same news post.")
        return data