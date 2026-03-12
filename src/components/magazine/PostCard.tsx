import type { Post } from '../../types/post';
import type { Tag } from '../../types/tag';
import { TagChip } from './TagChip';
import { InstagramEmbed } from './InstagramEmbed';

interface PostCardProps {
  post: Post;
  tagsMap: Record<string, Tag>;
}

export function PostCard({ post, tagsMap }: PostCardProps) {
  const postTags = post.tags
    .map((tagId) => tagsMap[tagId])
    .filter(Boolean);

  return (
    <article className="bg-shefel-yellow rounded-lg overflow-hidden border-4 border-shefel-red shadow-lg flex flex-col h-[600px]">
      <div className="flex-1 min-h-0 overflow-hidden">
        {post.instagramUrl ? (
          <InstagramEmbed url={post.instagramUrl} />
        ) : (
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
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
