"use client"; // Client Component for interactivity (carousel)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiGet } from '@/app/api/api';
import { Ad } from '@/app/types/ads';

// Define fallback image for broken/missing images
const FALLBACK_IMAGE = '/images/fallback-ad.jpg';

const AdBanner: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const data = await apiGet<Ad[]>('/ads/');
        console.log('Fetched ads:', data); // Debug: Log API response
        if (Array.isArray(data)) {
          setAds(data);
        } else {
          console.error('Unexpected API response format:', data);
          setError('Invalid ad data format.');
        }
      } catch (err: any) {
        console.error('Failed to fetch ads:', err.message, err);
        setError('Failed to load ads. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Auto-cycle through ads every 5 seconds
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads]);

  // Handle manual navigation
  const goToPrevious = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
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

  // Safeguard for invalid index
  const currentAd = ads[currentAdIndex] || ads[0];

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-8">
      {/* Ad Banner */}
      <Link href={currentAd.url || '#'} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-40 md:h-64">
          <Image
            src={currentAd.image || FALLBACK_IMAGE}
            alt={currentAd.title || 'Advertisement'}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
            priority={true}
            sizes="100vw"
            onError={() => console.error(`Failed to load image: ${currentAd.image}`)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
            <p className="text-sm md:text-lg">{currentAd.title || 'No title'}</p>
          </div>
        </div>
      </Link>

      {/* Navigation Arrows */}
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

      {/* Dots for Navigation */}
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