from django.urls import path
from .views import AdListCreateView

urlpatterns = [
    path('', AdListCreateView.as_view(), name='ad-list-create'),
]