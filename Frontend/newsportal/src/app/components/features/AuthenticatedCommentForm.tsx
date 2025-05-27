"use client";

import { useAuthStore } from '@/app/stores/authStore';
import CommentForm from './CommentForm';
import LoginForm from './LoginForm';
import { useState, useRef } from 'react';

export default function AuthenticatedCommentForm({ newsId }: { newsId: string }) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <CommentForm newsId={newsId} />;
  }

  return (
    <div className="mb-4">
      <p className="text-gray-500">
        Log in to post a comment.
        <button
          onClick={() => setShowLoginForm((prev) => !prev)}
          className="text-blue-600 ml-2 underline cursor-pointer"
        >
          {showLoginForm ? 'Hide Login' : 'Log in'}
        </button>
      </p>

      <div
        ref={containerRef}
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
          showLoginForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-4 border p-4 rounded-lg shadow bg-white">
          <LoginForm onSuccess={() => setShowLoginForm(false)} />
        </div>
      </div>
    </div>
  );
}