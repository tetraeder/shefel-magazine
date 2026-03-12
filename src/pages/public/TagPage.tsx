import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import type { Tag } from '../../types/tag';
import type { Post } from '../../types/post';
import type { MediaItem } from '../../types/media';
import { getTagBySlug } from '../../services/tags';
import { usePostsByTag } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { useMedia } from '../../hooks/useMedia';
import { PostCard } from '../../components/magazine/PostCard';
import { MediaCarouselCard } from '../../components/magazine/MediaCarouselCard';
import { Spinner } from '../../components/ui/Spinner';
import { isMockMode, MOCK_TAGS } from '../../lib/mockData';

type SortOrder = 'newest' | 'oldest';
type GridItem =
  | { type: 'post'; data: Post; time: number }
  | { type: 'media'; data: MediaItem; time: number };

export function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOrder>('newest');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    if (isMockMode()) {
      setTag(MOCK_TAGS.find((t) => t.slug === slug) || null);
      setLoading(false);
      return;
    }
    getTagBySlug(slug)
      .then(setTag)
      .finally(() => setLoading(false));
  }, [slug]);

  const { posts, loading: postsLoading } = usePostsByTag(tag?.id);
  const { tags } = useTags();
  const { media, loading: mediaLoading } = useMedia();

  const tagsMap = useMemo(() => {
    const map: Record<string, Tag> = {};
    tags.forEach((t) => { map[t.id] = t; });
    return map;
  }, [tags]);

  const allItems: GridItem[] = useMemo(() => {
    const items: GridItem[] = [];
    for (const p of posts) {
      items.push({ type: 'post', data: p, time: p.publishedAt?.toMillis() ?? p.createdAt.toMillis() });
    }
    if (tag) {
      for (const m of media.filter((m) => m.tags.includes(tag.id))) {
        items.push({ type: 'media', data: m, time: m.publishedAt?.toMillis() ?? m.createdAt.toMillis() });
      }
    }
    items.sort((a, b) => sort === 'newest' ? b.time - a.time : a.time - b.time);
    return items;
  }, [posts, media, tag, sort]);

  if (loading || postsLoading || mediaLoading) return <Spinner />;

  if (!tag) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-shefel-red text-xl">
          תגית לא נמצאה
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-center">
        <h1 className="font-display font-black text-shefel-red text-4xl">
          {tag.name}
        </h1>
        <Link
          to="/"
          className="inline-block font-body font-bold text-shefel-red hover:text-shefel-black transition-colors no-underline mt-2"
        >
          ← חזרה למגזין
        </Link>
      </div>

      {allItems.length > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setSort('newest')}
            className={`font-body font-bold text-sm px-3 py-1 rounded-full border-2 transition-all duration-200 active:scale-95 ${
              sort === 'newest'
                ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
                : 'bg-shefel-yellow text-shefel-red border-shefel-red/30 hover:border-shefel-red'
            }`}
          >
            חדש ← ישן
          </button>
          <button
            onClick={() => setSort('oldest')}
            className={`font-body font-bold text-sm px-3 py-1 rounded-full border-2 transition-all duration-200 active:scale-95 ${
              sort === 'oldest'
                ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
                : 'bg-shefel-yellow text-shefel-red border-shefel-red/30 hover:border-shefel-red'
            }`}
          >
            ישן ← חדש
          </button>
        </div>
      )}

      {allItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-display font-bold text-shefel-red text-xl">
            אין תוכן להצגה
          </p>
        </div>
      ) : (
        <div key={sort} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 grid-animate">
          {allItems.map((item) =>
            item.type === 'post' ? (
              <PostCard key={item.data.id} post={item.data} tagsMap={tagsMap} />
            ) : (
              <MediaCarouselCard key={item.data.id} item={item.data} tagsMap={tagsMap} />
            )
          )}
        </div>
      )}
    </>
  );
}
