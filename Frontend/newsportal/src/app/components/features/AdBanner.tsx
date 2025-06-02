'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiGet } from '@/app/api/api';
import { Ad } from '@/app/types/ads';
import { promises } from 'dns';

// Fallback image for broken/missing images
const FALLBACK_IMAGE = '/images/fallback-ad.jpg';

export default function AdBanner() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Fetch ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const data = await apiGet<Ad[]>('/ads/');
        if (Array.isArray(data)) {
          setAds(data);
        } else {
          console.error('Unexpected API response format:', data);
          setError('Invalid ad data format.');
        }
      } catch (err: any) {
        console.error('Failed to fetch ads:', err.message);
        setError('Failed to load ads.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    if (ads.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length, isPaused]);

  // Keyboard navigation (optional, for accessibility)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
      e.preventDefault();
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500 p-4">Loading ads...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (ads.length === 0) {
    return <div className="text-center text-gray-500 p-4">No ads available.</div>;
  }

  return (
    <div
      ref={bannerRef}
      className="relative w-full max-w-7xl mx-auto mb-8 focus:outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Advertisement banner"
    >
      <div className="relative overflow-hidden rounded-xl h-40 md:h-64">
        {ads.map((ad, index) => (
          <div
            key={ad.id}
            className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={index !== currentIndex}
            role="group"
            aria-roledescription="ad"
            aria-label={`Ad ${index + 1} of ${ads.length}`}
          >
            <Link href={ad.url || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <div className="relative w-full h-full group">
                <Image
                  src={ad.image || FALLBACK_IMAGE}
                  alt={ad.title || 'Advertisement'}
                  fill
                  className="object-cover rounded-xl"
                  priority={index === currentIndex}
                  sizes="(max-width: 768px) 100vw, 672px"
                  quality={80}
                  loading={index === currentIndex ? 'eager' : 'lazy'}
                  onError={() => console.error(`Failed to load ad image: ${ad.image}`)}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 flex flex-col justify-end p-3 md:p-4 rounded-xl z-20">
                  <h3 className="text-sm md:text-lg font-bold text-white drop-shadow-md line-clamp-2">
                    {ad.title || 'Advertisement'}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}