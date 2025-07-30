'use client';

import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics tracking function
export const GA_TRACKING_ID = 'G-L0V33E1LY5';

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
    console.log('📊 GA Pageview:', url);
  }
};

// Log specific events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // GA4 event format
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      // Add custom parameters for better tracking
      custom_parameter_1: category,
      custom_parameter_2: label,
      custom_parameter_3: value,
    });
    
    // Also log to console for debugging
    console.log('📊 GA Event:', { action, category, label, value });
  }
};

// Custom hook untuk tracking page views
export const useGoogleAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (GA_TRACKING_ID) {
      pageview(pathname);
    }
  }, [pathname]);
};

// Komponen utama Google Analytics
export default function GoogleAnalytics() {
  useGoogleAnalytics();

  return (
    <>
      {/* Vercel Analytics */}
      <Analytics />
    </>
  );
} 