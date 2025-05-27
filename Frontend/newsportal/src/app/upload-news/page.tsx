'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreatableSelect from 'react-select/creatable';
import type { MultiValue, ActionMeta } from 'react-select';
import { useAuthStore } from '@/app/stores/authStore';
import { apiGet } from '@/app/api/api';
import api from '@/app/api/api';
import { Category } from '../types/news';

type TagOption = {
  label: string;
  value: string; // Tag name (not slug, as taggit handles slugification)
};

export default function UploadNewsPage() {
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    if (!isAuthenticated || !user?.is_staff) {
      router.push('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const catData = await apiGet<Category[]>('/news/categories/');
        setCategories(catData);
        if (catData.length > 0) {
          setCategoryId(catData[0].id);
        } else {
          setCategoryId('custom');
        }
      } catch (err: any) {
        setError('Failed to load categories.');
      }
    };

    fetchCategories();
  }, [isAuthenticated, user, router]);

  // Fetch tag suggestions dynamically (optional, mimics Instagram's autocomplete)
const fetchTagSuggestions = async (inputValue: string) => {
  if (!inputValue) {
    setTagOptions([]);
    return;
  }
  try {
    // Expect a flat list of tags: [{ name: string, slug: string }, ...]
    const response = await apiGet<{ name: string; slug: string }[]>(
      `/news/tags/?search=${encodeURIComponent(inputValue)}`
    );
    // Ensure response is an array
    const tags = Array.isArray(response)
      ? response.map((tag) => ({
          label: tag.name,
          value: tag.name, // Use name as value, backend handles slug
        }))
      : [];
    setTagOptions(tags);
  } catch (err) {
    console.error('Failed to fetch tag suggestions:', err);
    setTagOptions([]); // Clear options on error
  }
};

  // Handle tag changes
  const handleTagChange = (
    newValue: MultiValue<TagOption>,
    actionMeta: ActionMeta<TagOption>
  ) => {
    setSelectedTags(newValue as TagOption[]);
  };

  // Handle tag input change for suggestions
  const handleTagInputChange = (inputValue: string) => {
    if (inputValue) {
      fetchTagSuggestions(inputValue);
    } else {
      setTagOptions([]);
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image (JPG/PNG).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }
      setImage(file);
    } else {
      setImage(null);
    }
  };

  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  if (!title.trim()) {
    setError('Title is required.');
    setIsLoading(false);
    return;
  }
  if (!content.trim()) {
    setError('Content is required.');
    setIsLoading(false);
    return;
  }
  if (!categoryId) {
    setError('Please select a category.');
    setIsLoading(false);
    return;
  }

  let finalCategoryId = categoryId;

  try {
    const isValidUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (categoryId === 'custom') {
      if (!customCategory.trim()) {
        setError('Please enter a new category name.');
        setIsLoading(false);
        return;
      }
      try {
        const newCat = await api.post<Category>(
          '/news/categories/',
          { name: customCategory.trim() },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        finalCategoryId = newCat.data.id;
        if (!isValidUUID(finalCategoryId)) {
          throw new Error('Invalid category ID format returned from server.');
        }
        setCategories([...categories, newCat.data]);
        setCategoryId(newCat.data.id);
      } catch (err: any) {
        setError(err.response?.data?.name?.[0] || 'Failed to create category.');
        setIsLoading(false);
        return;
      }
    } else if (!isValidUUID(finalCategoryId)) {
      setError('Please select a valid category.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('category_id', finalCategoryId);

    if (image) {
      formData.append('image', image);
    }

  
if (selectedTags.length > 0) {
  selectedTags.forEach((tag) => {
    formData.append('tags', tag.value.trim());
  });
}



    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    const response = await api.post<{ id: string; slug: string }>(
      '/news/',
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    router.push(`/news/${response.data.id}`);
  } catch (err: any) {
    const resData = err.response?.data;
    setError(
      resData?.detail ||
        resData?.non_field_errors?.[0] ||
        resData?.category_id?.[0] ||
        resData?.title?.[0] ||
        resData?.content?.[0] ||
        resData?.tags?.[0] ||
        JSON.stringify(resData) ||
        err.message ||
        'Failed to upload news.'
    );
  } finally {
    setIsLoading(false);
  }
};

  if (!isAuthenticated || !user?.is_staff) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload News</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <label className="block mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="custom">Other (Create New)</option>
          </select>
        </div>
        {categoryId === 'custom' && (
          <div>
            <label className="block mb-1">New Category Name:</label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter new category name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}
        <div>
          <label className="block mb-1">Tags:</label>
          <CreatableSelect
            isMulti
            options={tagOptions}
            value={selectedTags}
            onChange={handleTagChange}
            onInputChange={handleTagInputChange}
            placeholder="Type or select tags (e.g., python, news)"
            isClearable
            isSearchable
            formatCreateLabel={(inputValue) => `Create tag "${inputValue}"`}
            noOptionsMessage={() => 'Type to create or search tags'}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block mb-1">Image (optional):</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Uploading...' : 'Upload News'}
        </button>
      </form>
    </div>
  );
}