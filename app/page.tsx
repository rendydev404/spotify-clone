"use client";

import { useState, useEffect } from "react";
import TrackCard from "@/components/TrackCard";
import { TrackCardSkeleton } from "@/components/TrackCardSkeleton";
import { Track } from "@/types";
import { usePlayer } from "@/app/context/PlayerContext";


const shuffleArray = (array: Track[]): Track[] => {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function HomePage() {
  const [discoverTracks, setDiscoverTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    const getDiscoverTracks = async () => {
      setIsLoading(true);
      try {
        const artists = ['Taylor Swift', 'James Arthur', 'Yovie & Nuno', 'Tulus'];
        const promises = artists.map(artist =>
          fetch(`/api/spotify?q=artist:${encodeURIComponent(artist)}&type=track&limit=5`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        const allTracks = results.flatMap(result => result.tracks?.items || []);
        const validTracks = allTracks.filter((track: Track) => track && track.album?.images?.length > 0);
        setDiscoverTracks(shuffleArray(validTracks));
      } catch (error) {
        console.error("Gagal mengambil lagu rekomendasi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDiscoverTracks();
  }, []);

  const TracksGrid = ({ tracks }: { tracks: Track[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {tracks.map((track, index) => (
        <TrackCard
          key={`${track.id}-${index}`}
          track={track}
          onPlay={() => playSong(track, tracks, index)}
        />
      ))}
    </div>
  );
  
  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
       {Array.from({ length: 12 }).map((_, i) => <TrackCardSkeleton key={i} />)}
    </div>
  );

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Lagu Pilihan Untukmu</h1>
      {isLoading ? <SkeletonGrid /> : <TracksGrid tracks={discoverTracks} />}
    </main>
  );
}

// updateddd