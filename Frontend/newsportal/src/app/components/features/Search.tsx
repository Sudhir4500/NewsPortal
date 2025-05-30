"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/app/api/api";
import { News } from "@/app/types/news";
import { formatDate } from "@/utils/formatDate";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiGet<Category[]>("/news/categories/"); // ✅ Correct backend path
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch news results on query change
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await apiGet<News[]>(`/news/?search=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (err: any) {
        console.error("Search failed:", err.message);
        setError("Failed to search news. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle Enter key for category redirect
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      const match = categories.find(
        (cat) => cat.name.toLowerCase() === query.trim().toLowerCase()
      );

      if (match) {
        router.push(`/category/${match.slug}`);
      } else if (results.length === 0) {
        setError("Category not found.");
      }
    }
  };

  // Filter categories for suggestion
  const matchingCategories = query.trim()
    ? categories.filter((cat) =>
        cat.name.toLowerCase().startsWith(query.trim().toLowerCase())
      )
    : [];

  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setError(null);
        }}
        onKeyPress={handleKeyPress}
        placeholder="Search by title, content, or category..."
        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />

      {isLoading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Suggested categories */}
      {matchingCategories.length > 0 && (
        <ul className="mb-3 max-h-40 overflow-y-auto border rounded bg-white shadow">
          {matchingCategories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => router.push(`/category/${cat.slug}`)}
              className="p-2 cursor-pointer hover:bg-blue-50"
            >
              🔎 {cat.name}
            </li>
          ))}
        </ul>
      )}

      {/* News search results */}
      {results.length > 0 && (
        <ul className="max-h-60 overflow-y-auto border rounded bg-white shadow">
          {results.map((news) => (
            <li key={news.id} className="p-2 border-b hover:bg-gray-50">
              <Link href={`/news/${news.id}`} className="text-blue-600 hover:underline">
                {news.title}
              </Link>
              <p className="text-sm text-gray-700">
                {news.content.slice(0, 50)}...
              </p>
              <p className="text-xs text-gray-500">
                By {news.author.username} on {formatDate(news.published_at)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {results.length === 0 && query.trim() && !isLoading && !error && (
        <p className="text-gray-500">No news found.</p>
      )}
    </div>
  );
};

export default Search;
