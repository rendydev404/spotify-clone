// components/TrackCardSkeleton.tsx
import React from 'react';

// Skeleton untuk tampilan Card (Homepage, Playlist)
export const TrackCardSkeleton = () => (
  <div className="bg-zinc-800 p-4 rounded-lg animate-pulse">
    <div className="relative w-full aspect-square mb-4 bg-zinc-700 rounded-md"></div>
    <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
  </div>
);

// Skeleton untuk tampilan List (Halaman Pencarian)
export const TrackListSkeleton = () => (
    <div className="flex items-center p-2 rounded-md animate-pulse">
        <div className="w-10 h-10 bg-zinc-700 rounded-md mr-4"></div>
        <div className="flex-grow">
            <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
        </div>
    </div>
);