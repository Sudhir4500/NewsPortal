import { User } from './auth';

// NewsSummary type (minimal news data for comments)
export interface NewsSummary {
  id: string; // UUID
  title: string;
  slug: string;
}

// Comment type (matches Django Comment model with nested replies)
export interface Comment {
  id: string; // UUID
  news: NewsSummary; // Nested news object (minimal data)
  news_id: string; // UUID (used for creating comments)
  author: User; // Nested user object
  content: string;
  parent_id?: string | null; // UUID of parent comment (nullable for top-level comments)
  replies: Comment[]; // Array of nested replies
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}