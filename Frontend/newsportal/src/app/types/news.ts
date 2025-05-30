import { User } from './auth';

// tag type (matches Django Tag model)
export interface Tag {
  id: number;
  name: string;
  slug: string;
}


// Category type (matches Django Category model)
export interface Category {
  id: string; // UUID
  name: string;
  slug: string;
}

// News type (matches Django News model)
export interface News {
  tags: Tag[];
  id: string; // UUID
  title: string;
  slug: string;
  content: string;
  author: User; // Nested user object (from accounts app)
  category: Category; // Nested category object
  category_id: string; // UUID (used for creating/updating news)
  image: string | null; // URL to image (nullable)
  published_at: string; // ISO 8601 datetime (e.g., "2025-05-18T15:14:00Z")
  updated_at: string; // ISO 8601 datetime
  is_trending: boolean; // Whether this news is trending
  is_carousel: boolean; // Whether this news is featured in the carousel
}


export type { User };

