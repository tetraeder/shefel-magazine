import { useState } from 'react';
import type { MediaItem } from '../../types/media';
import type { Tag } from '../../types/tag';
import { TagChip } from './TagChip';
import { ShareButton } from './ShareButton';

interface MediaCardProps {
  item: MediaItem;
  tagsMap: Record<string, Tag>;
  autoPlay?: boolean;
}

export function MediaCard({ item, tagsMap, autoPlay = false }: MediaCardProps) {
  const [playing, setPlaying] = useState(autoPlay);

  const itemTags = item.tags
    .map((id) => tagsMap[id])
    .filter(Boolean);

  return (
    <div className="group">
      <div
        className="relative aspect-[9/16] bg-shefel-black rounded-lg overflow-hidden shadow-[8px_8px_0px_theme(--color-shefel-red)] cursor-pointer"
        onClick={() => !playing && setPlaying(true)}
      >
        {playing ? (
          item.mediaOriginUrl.includes('mediadelivery.net') ? (
            <iframe
              src={item.mediaOriginUrl.replace('/play/', '/embed/')}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={item.mediaOriginUrl}
              autoPlay
              muted={autoPlay}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <>
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <svg
                className="w-16 h-16 text-shefel-white drop-shadow-lg group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <ShareButton url={`${window.location.origin}/media?v=${item.id}`} title={item.title} />
        <p className="font-display font-bold text-shefel-black text-lg">
          {item.title}
        </p>
      </div>
      {item.credits && (
        <p className="text-center text-shefel-red text-sm mt-1">
          {item.credits}
        </p>
      )}
      {itemTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {itemTags.map((tag) => (
            <TagChip key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
