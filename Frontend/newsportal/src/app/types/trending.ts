

// app/types/trending.ts
export interface TrendingNews {
  id: string;
  news: string; // UUID string
  news_title: string;
  added_at: string;
  is_active: boolean;
}