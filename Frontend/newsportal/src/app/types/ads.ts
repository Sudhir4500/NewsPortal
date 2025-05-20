// src/types/ads.ts
export interface Ad {
  id: string; // UUID
  title: string;
  image: string; // URL to the ad image
  url: string; // URL to redirect when ad is clicked
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}