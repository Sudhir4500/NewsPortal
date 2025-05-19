from django.urls import path
from .views import NewsListCreateView, NewsDetailView, CategoryListCreateView

urlpatterns = [
    path('', NewsListCreateView.as_view(), name='news-list-create'),
    path('<uuid:id>/', NewsDetailView.as_view(), name='news-detail'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
]