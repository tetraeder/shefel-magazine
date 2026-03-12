import { useState, useCallback } from 'react';
import type { Post } from '../../types/post';
import type { Tag } from '../../types/tag';
import { TagChip } from './TagChip';
import { InstagramEmbed } from './InstagramEmbed';

interface PostCardProps {
  post: Post;
  tagsMap: Record<string, Tag>;
}

function PostCardSkeleton() {
  return (
    <div className="bg-shefel-white rounded-lg overflow-hidden border-4 border-shefel-red/20 shadow-lg animate-pulse">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-shefel-red/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-shefel-red/10 rounded w-2/5" />
            <div className="h-2 bg-shefel-red/8 rounded w-1/4" />
          </div>
        </div>
        <div className="aspect-[4/5] bg-shefel-red/8 rounded" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-shefel-red/10 rounded w-4/5" />
          <div className="h-3 bg-shefel-red/8 rounded w-3/5" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-7 w-16 bg-shefel-red/10 rounded-full" />
          <div className="h-7 w-20 bg-shefel-red/8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PostCard({ post, tagsMap }: PostCardProps) {
  const hasEmbed = !!post.instagramUrl;
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const onLoaded = useCallback(() => setEmbedLoaded(true), []);

  const postTags = post.tags
    .map((tagId) => tagsMap[tagId])
    .filter(Boolean);

  // No embed — render immediately
  if (!hasEmbed) {
    return (
      <article className="bg-shefel-yellow rounded-lg overflow-hidden border-4 border-shefel-red shadow-lg flex flex-col">
        <div className="min-h-0">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        {postTags.length > 0 && (
          <div className="p-3 flex flex-wrap gap-2 shrink-0">
            {postTags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </article>
    );
  }

  return (
    <div className="relative">
      {/* Real card — always in the DOM so Instagram can process it */}
      <article
        className={`rounded-lg overflow-hidden flex flex-col transition-opacity duration-300 ${
          embedLoaded
            ? 'bg-shefel-yellow border-4 border-shefel-red shadow-lg opacity-100'
            : 'opacity-0'
        }`}
      >
        <div className="min-h-0">
          <InstagramEmbed url={post.instagramUrl!} onLoaded={onLoaded} />
        </div>
        {embedLoaded && postTags.length > 0 && (
          <div className="p-3 flex flex-wrap gap-2 shrink-0">
            {postTags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </article>

      {/* Skeleton overlay — covers everything until embed loads */}
      {!embedLoaded && (
        <div className="absolute inset-0 z-10">
          <PostCardSkeleton />
        </div>
      )}
    </div>
  );
}
