import { useState } from 'react';
import type { MediaItem } from '../../types/media';
import type { Tag } from '../../types/tag';
import { TagChip } from './TagChip';

interface MediaCarouselCardProps {
  item: MediaItem;
  tagsMap: Record<string, Tag>;
}

export function MediaCarouselCard({ item, tagsMap }: MediaCarouselCardProps) {
  const [playing, setPlaying] = useState(false);

  const itemTags = item.tags
    .map((id) => tagsMap[id])
    .filter(Boolean);

  return (
    <article className="bg-shefel-yellow rounded-lg overflow-hidden border-4 border-shefel-red shadow-lg flex flex-col">
      <div
        className="relative aspect-[9/16] bg-shefel-black cursor-pointer"
        onClick={() => !playing && setPlaying(true)}
      >
        {playing ? (
          <video
            src={item.cloudinaryUrl}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <svg
                className="w-16 h-16 text-shefel-white drop-shadow-lg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </>
        )}
      </div>
      <div className="p-3 shrink-0">
        <p className="font-display font-bold text-shefel-black text-center text-lg">
          {item.title}
        </p>
        {itemTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {itemTags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
