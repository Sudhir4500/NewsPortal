from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'news', 'created_at']
    list_filter = ['created_at', 'author', 'news']