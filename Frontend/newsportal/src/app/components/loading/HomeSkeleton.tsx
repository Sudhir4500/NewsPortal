import React from 'react';

export default function HomeSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Carousel Section Skeleton */}
      <section className="mb-12">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 rounded-2xl"></div>
      </section>

      {/* Ad Banner Skeleton */}
      <div className="mb-8">
        <div className="w-full h-32 sm:h-40 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Trending News Section Skeleton */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large News (2 cols) */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] bg-gray-200 rounded-2xl">
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Small News (1 col) */}
          <div className="lg:col-span-1">
            <div className="h-[350px] sm:h-[450px] lg:h-[500px] bg-gray-200 rounded-lg">
              <div className="h-40 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          {/* Second Row: 4 News Items */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-full">
                <div className="h-[300px] bg-gray-200 rounded-lg">
                  <div className="h-40 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      {[...Array(2)].map((_, catIndex) => (
        <section key={catIndex} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {[...Array(5)].map((_, newsIndex) => (
              <div key={newsIndex} className="snap-start w-[250px]">
                <div className="h-[300px] bg-gray-200 rounded-lg">
                  <div className="h-40 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}