from django.contrib import admin
from .models import News, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'id']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'published_at', 'id']
    list_filter = ['category', 'published_at']
    prepopulated_fields = {'slug': ('title',)}