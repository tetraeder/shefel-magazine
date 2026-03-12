import type { Post } from '../../types/post';
import type { Tag } from '../../types/tag';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: Post[];
  tagsMap: Record<string, Tag>;
}

export function PostGrid({ posts, tagsMap }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-shefel-red text-xl">
          אין פוסטים להצגה
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="card-animate"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <PostCard post={post} tagsMap={tagsMap} />
        </div>
      ))}
    </div>
  );
}
