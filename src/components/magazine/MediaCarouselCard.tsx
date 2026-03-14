import { useRef, useEffect } from 'react';
import type { MediaItem } from '../../types/media';
import type { Tag } from '../../types/tag';
import { TagChip } from './TagChip';
import { ShareButton } from './ShareButton';

interface MediaCarouselCardProps {
  item: MediaItem;
  tagsMap: Record<string, Tag>;
  isActive?: boolean;
}

export function MediaCarouselCard({ item, tagsMap, isActive = false }: MediaCarouselCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  const itemTags = item.tags
    .map((id) => tagsMap[id])
    .filter(Boolean);

  return (
    <article className="bg-shefel-yellow rounded-none overflow-hidden border-4 border-shefel-red shadow-lg flex flex-col">
      <div className="relative aspect-[9/16] bg-shefel-black">
        <video
          ref={videoRef}
          src={item.cloudinaryUrl}
          poster={item.thumbnailUrl}
          muted
          playsInline
          controls
          preload="none"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 shrink-0">
        <div className="flex items-center justify-center gap-2">
          <ShareButton url={`${window.location.origin}/media?v=${item.id}`} title={item.title} />
          <p className="font-display font-bold text-shefel-black text-lg">
            {item.title}
          </p>
        </div>
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
