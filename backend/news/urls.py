from django.urls import path
from .views import NewsListCreateView, NewsDetailView, CategoryListCreateView, TagNewsListView, TagListView

urlpatterns = [
    path('', NewsListCreateView.as_view(), name='news-list-create'),
    path('<uuid:id>/', NewsDetailView.as_view(), name='news-detail'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('tags/', TagListView.as_view(), name='tag-list-create'),

    path('tags/<slug:slug>/', TagNewsListView.as_view(), name='tag-news-list'),
    
]

