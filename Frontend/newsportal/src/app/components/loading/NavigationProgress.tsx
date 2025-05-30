// components/features/NavigationProgress.tsx
"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Router from 'next/router';

export default function NavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const handleStart = () => {
      setIsLoading(true);
      setProgress(10); // Start at 10% immediately
      // Simulate progress
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as progress increases
          const increment = prev < 50 ? 10 : prev < 80 ? 5 : 2;
          return Math.min(prev + increment, 90); // Never reach 100% until complete
        });
      }, 300);
    };

    const handleComplete = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    };

    // Listen to route changes
    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    // Also handle initial page load
    const handlePageLoad = () => {
      if (document.readyState === 'complete') {
        handleComplete();
      }
    };

    window.addEventListener('load', handlePageLoad);

    return () => {
      clearInterval(interval);
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
      window.removeEventListener('load', handlePageLoad);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-gray-200">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}