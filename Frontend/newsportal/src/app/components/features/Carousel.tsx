'use client';
import { useState, useEffect, useRef } from 'react';
import { News } from '@/app/types/news';
import Image from 'next/image';
import Link from 'next/link';

interface CarouselProps {
  initialNews: News[];
}

export default function Carousel({ initialNews }: CarouselProps) {
  const [news] = useState<News[]>(initialNews || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-switch every 5 seconds
  useEffect(() => {
    if (news.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [news.length, isPaused]);

  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      goToNext();
      e.preventDefault();
    }
  };

  // Format date safely
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Unknown Date';
    }
  };

  if (!news.length) return null;

  return (
    <div
      ref={carouselRef}
      className="relative w-full mb-12 mx-auto max-w-[1200px] focus:outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Featured news carousel"
    >
      <div className="relative overflow-hidden rounded-xl h-[300px] sm:h-[400px] lg:h-[500px]">
        {news.map((item, index) => (
          <div
            key={item.id}
            className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={index !== currentIndex}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${news.length}`}
          >
            <Link href={`/news/${item.id}`} className="block w-full h-full">
              <div className="relative w-full h-full group">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-xl transition-transform duration-700 ease-in-out group-hover:scale-105"
                    priority={index === currentIndex}
                    sizes="(max-width: 768px) 100vw, 1200px"
                    quality={80}
                    loading={index === currentIndex ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image Available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 flex flex-col justify-end p-4 sm:p-6 rounded-xl z-20">
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-md line-clamp-2 mb-2">
                    {item.title}
                  </h2>
                  <div className="flex justify-between items-center text-sm text-gray-200">
                    <span>
                      By {item.author?.username || 'Unknown Author'} | {formatDate(item.published_at)}
                    </span>
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                      {item.category.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {news.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-30 opacity-100 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-30 opacity-100 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {news.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-blue-600 w-6' : 'bg-white bg-opacity-50'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}