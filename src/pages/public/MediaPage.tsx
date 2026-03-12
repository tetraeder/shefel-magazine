import { useState, useMemo } from 'react';
import { useMedia } from '../../hooks/useMedia';
import { useTags } from '../../hooks/useTags';
import { MediaCard } from '../../components/magazine/MediaCard';
import { Spinner } from '../../components/ui/Spinner';
import type { Tag } from '../../types/tag';

type SortOrder = 'newest' | 'oldest';

export function MediaPage() {
  const { media, loading } = useMedia();
  const { tags } = useTags();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOrder>('newest');

  const tagsMap: Record<string, Tag> = {};
  for (const tag of tags) {
    tagsMap[tag.id] = tag;
  }

  // Only show tags that are used by at least one media item
  const usedTagIds = new Set(media.flatMap((m) => m.tags));
  const mediaTags = tags.filter((t) => usedTagIds.has(t.id));

  const filtered = activeTag
    ? media.filter((m) => m.tags.includes(activeTag))
    : media;

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aTime = a.publishedAt?.toMillis() ?? a.createdAt.toMillis();
      const bTime = b.publishedAt?.toMillis() ?? b.createdAt.toMillis();
      return sort === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [filtered, sort]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display font-black text-shefel-red text-4xl text-center mb-6">
        מדיה
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {mediaTags.length > 0 && (
          <>
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 text-sm font-bold rounded-full border-2 transition-all duration-200 active:scale-95 ${
                activeTag === null
                  ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
                  : 'bg-shefel-yellow text-shefel-red border-shefel-red hover:bg-shefel-red hover:text-shefel-yellow'
              }`}
            >
              הכל
            </button>
            {mediaTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`px-3 py-1 text-sm font-bold rounded-full border-2 transition-colors ${
                  activeTag === tag.id
                    ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
                    : 'bg-shefel-yellow text-shefel-red border-shefel-red hover:bg-shefel-red hover:text-shefel-yellow'
                }`}
              >
                {tag.name}
              </button>
            ))}
            <span className="text-shefel-red/30 mx-1">|</span>
          </>
        )}
        <button
          onClick={() => setSort('newest')}
          className={`px-3 py-1 text-sm font-bold rounded-full border-2 transition-all duration-200 active:scale-95 ${
            sort === 'newest'
              ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
              : 'bg-shefel-yellow text-shefel-red border-shefel-red/30 hover:border-shefel-red'
          }`}
        >
          חדש ← ישן
        </button>
        <button
          onClick={() => setSort('oldest')}
          className={`px-3 py-1 text-sm font-bold rounded-full border-2 transition-all duration-200 active:scale-95 ${
            sort === 'oldest'
              ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
              : 'bg-shefel-yellow text-shefel-red border-shefel-red/30 hover:border-shefel-red'
          }`}
        >
          ישן ← חדש
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-gray-500 font-body">אין תוכן מדיה עדיין</p>
      ) : (
        <div key={`${activeTag}-${sort}`} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 grid-animate">
          {sorted.map((item) => (
            <MediaCard key={item.id} item={item} tagsMap={tagsMap} />
          ))}
        </div>
      )}
    </div>
  );
}
