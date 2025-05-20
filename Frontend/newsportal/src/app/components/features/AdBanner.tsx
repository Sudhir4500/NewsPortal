"use client"; // Client Component for interactivity (carousel)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiGet } from '@/app/api/api';
import { Ad } from '@/app/types/ads';

const AdBanner: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await apiGet<Ad[]>('/ads/');
        setAds(data);
      } catch (err: any) {
        console.error('Failed to fetch ads:', err.message);
        setError('Failed to load ads. Please try again later.');
      }
    };
    fetchAds();
  }, []);

  // Auto-cycle through ads every 5 seconds
  useEffect(() => {
    if (ads.length <= 1) return; // No need for carousel if 0 or 1 ad

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [ads]);

  // Handle manual navigation (optional)
  const goToPrevious = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (ads.length === 0) {
    return <div className="text-center text-gray-500 p-4">No ads available.</div>;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="relative w-full mx-auto mb-8">
      {/* Ad Banner */}
      <Link href={currentAd.url} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-40 md:h-64">
          <Image
            src={currentAd.image}
            alt={currentAd.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
            priority={true} // Prioritize loading for above-the-fold content
            sizes="100vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
            <p className="text-sm md:text-lg">{currentAd.title}</p>
          </div>
        </div>
      </Link>

      {/* Navigation Arrows (Optional) */}
      {ads.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
          >
            ←
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
          >
            →
          </button>
        </>
      )}

      {/* Dots for Navigation (Optional) */}
      {ads.length > 1 && (
        <div className="flex justify-center mt-2 space-x-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentAdIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdBanner;