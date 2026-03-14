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

function EmbedLoadingIndicator() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-14 h-14 border-[5px] border-shefel-red/30 border-t-shefel-red rounded-full animate-spin" />
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
      <article className="bg-shefel-yellow rounded-none overflow-hidden border-4 border-shefel-red shadow-lg flex flex-col">
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
      {/* Loading spinner — minimal, no card UI until embed is ready */}
      {!embedLoaded && <EmbedLoadingIndicator />}

      {/* Embed container — fully hidden while loading, normal card when loaded */}
      <div
        className={
          embedLoaded
            ? 'bg-shefel-yellow rounded-none overflow-hidden border-4 border-shefel-red shadow-lg flex flex-col'
            : 'invisible absolute top-0 left-0 w-full h-0 overflow-hidden'
        }
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
