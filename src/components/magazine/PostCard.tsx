import { useState, useCallback } from 'react';
import type { Post } from '../../types/post';
import type { Tag } from '../../types/tag';
import { TagChip } from './TagChip';
import { InstagramEmbed } from './InstagramEmbed';
import { ShareButton } from './ShareButton';

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
        <div className="p-3 flex flex-wrap items-center gap-2 shrink-0">
          <ShareButton url={post.instagramUrl || post.imageUrl} title={post.caption} />
          {postTags.map((tag) => (
            <TagChip key={tag.id} tag={tag} />
          ))}
        </div>
      </article>
    );
  }

  return (
    <div className="relative">
      {/* Skeleton — normal flow, provides height */}
      {!embedLoaded && <PostCardSkeleton />}

      {/* Embed container — clipped invisible while loading, normal card when loaded */}
      <div
        className={
          embedLoaded
            ? 'bg-shefel-yellow rounded-lg overflow-hidden border-4 border-shefel-red shadow-lg flex flex-col'
            : 'absolute top-0 left-0 w-full'
        }
        style={embedLoaded ? undefined : { clipPath: 'inset(100%)', overflow: 'hidden' }}
      >
        <div className="min-h-0">
          <InstagramEmbed url={post.instagramUrl!} onLoaded={onLoaded} />
        </div>
        {embedLoaded && (
          <div className="p-3 flex flex-wrap items-center gap-2 shrink-0">
            <ShareButton url={post.instagramUrl!} title={post.caption} />
            {postTags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
