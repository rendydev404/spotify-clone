import { Track } from "@/types";
import Image from "next/image";

export default function TrackCard({ track }: { track: Track }) {
  const imageUrl = track.album.images?.[0]?.url;

  return (
    <div className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors group cursor-pointer">
      <div className="relative w-full aspect-square mb-4">
        {imageUrl && (
           <Image
            src={imageUrl}
            alt={track.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>
      <h3 className="font-bold truncate text-white">{track.name}</h3>
      <p className="text-sm text-zinc-400 truncate">
        {track.artists.map((artist) => artist.name).join(", ")}
      </p>
    </div>
  );
}