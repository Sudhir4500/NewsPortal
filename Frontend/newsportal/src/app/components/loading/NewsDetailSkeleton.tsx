import React from 'react';

export default function NewsDetailSkeleton() {
  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6 animate-pulse">
      {/* Main content skeleton */}
      <div className="lg:w-2/3 space-y-6">
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="mt-10">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      {/* Sidebar skeleton */}
      <div className="lg:w-1/3 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}