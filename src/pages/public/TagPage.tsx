import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo, useRef } from 'react';
import type { Tag } from '../../types/tag';
import type { MediaItem } from '../../types/media';
import { getTagBySlug } from '../../services/tags';
import { usePostsByTag } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { useMedia } from '../../hooks/useMedia';
import { PostCard } from '../../components/magazine/PostCard';
import { ShareButton } from '../../components/magazine/ShareButton';
import { TagChip } from '../../components/magazine/TagChip';
import { Spinner } from '../../components/ui/Spinner';
import { isMockMode, MOCK_TAGS } from '../../lib/mockData';

type SortOrder = 'newest' | 'oldest';

function getBackLabel(path: string): string {
  if (path === '/' || path === '/media') return '← חזרה למדיה';
  if (path === '/magazine') return '← חזרה למגזין';
  if (path.startsWith('/issue/')) return '← חזרה לגיליון';
  return '← חזרה';
}

function PlaylistMainVideo({ item, tagsMap }: { item: MediaItem; tagsMap: Record<string, Tag> }) {
  const isBunny = item.mediaOriginUrl?.includes('mediadelivery.net');
  const itemTags = item.tags.map((id) => tagsMap[id]).filter(Boolean);

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-[9/16] max-h-[70vh] w-full bg-shefel-black rounded-lg overflow-hidden shadow-[8px_8px_0px_theme(--color-shefel-red)]">
        {isBunny ? (
          <iframe
            src={item.mediaOriginUrl.replace('/play/', '/embed/') + '?autoplay=true'}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={item.id}
            src={item.mediaOriginUrl}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <ShareButton url={`${window.location.origin}/media?v=${item.id}`} title={item.title} />
        <h2 className="font-display font-bold text-shefel-black text-2xl">
          {item.title}
        </h2>
      </div>
      {item.credits && (
        <p className="text-center text-shefel-red text-base mt-1">קרדיט: {item.credits}</p>
      )}
      {itemTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {itemTags.map((t) => <TagChip key={t.id} tag={t} />)}
        </div>
      )}
    </div>
  );
}

function PlaylistSidebar({
  items,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
}: {
  items: MediaItem[];
  activeId: string;
  onSelect: (item: MediaItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeId]);

  const filtered = searchQuery
    ? items.filter((item) => item.title.includes(searchQuery))
    : items;

  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] lg:max-h-[calc(70vh+4rem)] pl-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-shefel-red) transparent' }}>
      <p className="font-display font-bold text-shefel-red text-lg sticky top-0 bg-shefel-yellow py-2 z-10">
        הבא בתור ({filtered.length})
      </p>
      {items.length > 3 && (
        <div className="sticky top-10 bg-shefel-yellow z-10 pb-2">
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="חיפוש..."
            className="w-full border-2 border-shefel-red rounded-lg px-3 py-2 text-base font-body text-shefel-red placeholder:text-shefel-red/50 focus:outline-none bg-shefel-yellow"
          />
        </div>
      )}
      <div key={searchQuery} className="flex flex-col gap-3 grid-animate">
      {filtered.map((item, i) => (
        <button
          key={item.id}
          ref={item.id === activeId ? activeRef : null}
          onClick={() => onSelect(item)}
          className={`flex gap-3 items-center text-right rounded-lg p-3 transition-colors cursor-pointer ${
            item.id === activeId
              ? 'bg-shefel-red/10 border-2 border-shefel-red'
              : 'hover:bg-shefel-red/5 border-2 border-transparent'
          }`}
        >
          <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-shefel-black">
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-shefel-white text-lg">▶</div>
            )}
            <span className="absolute top-1 right-1 bg-shefel-black/70 text-shefel-white text-sm font-bold px-1.5 rounded">
              {i + 1}
            </span>
          </div>
          <span className="font-body font-bold text-base text-shefel-black line-clamp-2">
            {item.title}
          </span>
        </button>
      ))}
      </div>
      {filtered.length === 0 && searchQuery && (
        <p className="text-center text-shefel-red/60 font-body text-base py-4">
          לא נמצאו תוצאות
        </p>
      )}
    </div>
  );
}

export function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const from: string = (location.state as { from?: string })?.from ?? '/';
  const backLabel = getBackLabel(from);
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOrder>('newest');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const tagMedia = useMemo(() => {
    if (!tag) return [];
    const items = media.filter((m) => m.tags.includes(tag.id));
    items.sort((a, b) => {
      const at = a.publishedAt?.toMillis() ?? a.createdAt.toMillis();
      const bt = b.publishedAt?.toMillis() ?? b.createdAt.toMillis();
      return sort === 'newest' ? bt - at : at - bt;
    });
    return items;
  }, [media, tag, sort]);

  const sortedPosts = useMemo(() => {
    const items = [...posts];
    items.sort((a, b) => {
      const at = a.publishedAt?.toMillis() ?? a.createdAt.toMillis();
      const bt = b.publishedAt?.toMillis() ?? b.createdAt.toMillis();
      return sort === 'newest' ? bt - at : at - bt;
    });
    return items;
  }, [posts, sort]);

  useEffect(() => {
    if (tagMedia.length > 0 && !activeVideoId) {
      setActiveVideoId(tagMedia[0].id);
    }
  }, [tagMedia, activeVideoId]);

  const activeVideo = tagMedia.find((m) => m.id === activeVideoId) ?? tagMedia[0];

  if (loading || postsLoading || mediaLoading) return <Spinner />;

  if (!tag) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-shefel-red text-2xl">
          תגית לא נמצאה
        </p>
      </div>
    );
  }

  const hasMedia = tagMedia.length > 0;
  const hasPosts = sortedPosts.length > 0;
  const hasMultipleMedia = tagMedia.length > 1;

  return (
    <>
      <div className="mb-4 text-center">
        <h1 className="font-display font-black text-shefel-red text-4xl">
          {tag.name}
        </h1>
        <div className="flex justify-center gap-4 mt-2">
          <Link
            to={from}
            className="font-body font-bold text-shefel-red text-lg hover:text-shefel-black transition-colors no-underline"
          >
            {backLabel}
          </Link>
          <Link
            to="/tag/המקומון"
            state={{ from }}
            className="font-body font-bold text-shefel-red text-lg hover:text-shefel-black transition-colors no-underline"
          >
            ← המקומון
          </Link>
        </div>
      </div>

      {(hasMedia || hasPosts) && (tagMedia.length + sortedPosts.length) > 1 && (
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setSort('newest')}
            className={`font-body font-bold text-base px-4 py-2 rounded-full border-2 transition-all duration-200 active:scale-95 ${
              sort === 'newest'
                ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
                : 'bg-shefel-yellow text-shefel-red border-shefel-red/30 hover:border-shefel-red'
            }`}
          >
            חדש ← ישן
          </button>
          <button
            onClick={() => setSort('oldest')}
            className={`font-body font-bold text-base px-4 py-2 rounded-full border-2 transition-all duration-200 active:scale-95 ${
              sort === 'oldest'
                ? 'bg-shefel-red text-shefel-yellow border-shefel-yellow'
                : 'bg-shefel-yellow text-shefel-red border-shefel-red/30 hover:border-shefel-red'
            }`}
          >
            ישן ← חדש
          </button>
        </div>
      )}

      {/* Desktop: playlist layout */}
      {hasMedia && (
        <>
          <div className="hidden lg:block max-w-5xl mx-auto px-4 mb-8">
            <div className={`grid gap-8 ${hasMultipleMedia ? 'grid-cols-[320px_1fr]' : 'grid-cols-1 max-w-lg mx-auto'}`} dir="rtl">
              {hasMultipleMedia && (
                <PlaylistSidebar
                  items={tagMedia}
                  activeId={activeVideo?.id ?? ''}
                  onSelect={(item) => setActiveVideoId(item.id)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}
              {activeVideo && (
                <PlaylistMainVideo item={activeVideo} tagsMap={tagsMap} />
              )}
            </div>
          </div>

          {/* Mobile view: sticky mini-player + playlist */}
          <div className="lg:hidden mb-8">
            {/* Sticky mini-player */}
            {activeVideo && (
              <div className="sticky top-14 z-20 bg-shefel-yellow/95 backdrop-blur-sm pb-2 pt-2 px-3 shadow-lg rounded-b-xl">
                <div className="relative aspect-[9/16] max-h-[55vh] mx-auto bg-shefel-black rounded-lg overflow-hidden shadow-[4px_4px_0px_theme(--color-shefel-red)]">
                  {activeVideo.mediaOriginUrl?.includes('mediadelivery.net') ? (
                    <iframe
                      key={activeVideo.id}
                      src={activeVideo.mediaOriginUrl.replace('/play/', '/embed/') + '?autoplay=true'}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={activeVideo.id}
                      src={activeVideo.mediaOriginUrl}
                      autoPlay
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <p className="font-display font-bold text-shefel-black text-base text-center mt-1 truncate">
                  {activeVideo.title}
                </p>
              </div>
            )}
            {/* Scrollable playlist */}
            <div className="px-4 pt-3 space-y-2">
              {tagMedia.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveVideoId(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex gap-3 items-center w-full text-right rounded-lg p-3 transition-colors ${
                    item.id === activeVideo?.id
                      ? 'bg-shefel-red/10 border-2 border-shefel-red'
                      : 'border-2 border-transparent hover:bg-shefel-red/5'
                  }`}
                >
                  <div className="relative w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-shefel-black">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-shefel-white">▶</div>
                    )}
                    <span className="absolute top-1 right-1 bg-shefel-black/70 text-shefel-white text-xs font-bold px-1.5 rounded">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body font-bold text-base text-shefel-black line-clamp-2 block">
                      {item.title}
                    </span>
                    {item.credits && (
                      <span className="text-shefel-red text-sm">קרדיט: {item.credits}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Posts grid */}
      {hasPosts && (
        <>
          {hasMedia && (
            <h2 className="font-display font-bold text-shefel-black text-2xl text-center mb-4">
              פוסטים
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 grid-animate">
            {sortedPosts.map((post) => (
              <PostCard key={post.id} post={post} tagsMap={tagsMap} />
            ))}
          </div>
        </>
      )}

      {!hasMedia && !hasPosts && (
        <div className="text-center py-16">
          <p className="font-display font-bold text-shefel-red text-2xl">
            אין תוכן להצגה
          </p>
        </div>
      )}
    </>
  );
}
