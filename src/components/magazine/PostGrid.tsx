import { useRef, useState, useEffect, useCallback } from 'react';
import type { Post } from '../../types/post';
import type { MediaItem } from '../../types/media';
import type { Tag } from '../../types/tag';
import { PostCard } from './PostCard';
import { MediaCarouselCard } from './MediaCarouselCard';

export type CarouselItem =
  | { type: 'post'; data: Post }
  | { type: 'media'; data: MediaItem };

interface PostGridProps {
  items?: CarouselItem[];
  posts?: Post[];
  tagsMap: Record<string, Tag>;
}

export function PostGrid({ items, posts, tagsMap }: PostGridProps) {
  // Support both new `items` prop and legacy `posts` prop
  const resolvedItems: CarouselItem[] = items ?? (posts ?? []).map((p) => ({ type: 'post' as const, data: p }));
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidePadding, setSidePadding] = useState(0);

  // Calculate padding so first/last card can be centered
  const updatePadding = useCallback(() => {
    const container = scrollRef.current;
    const firstCard = cardRefs.current[0];
    if (!container || !firstCard) return;
    const pad = (container.offsetWidth - firstCard.offsetWidth) / 2;
    setSidePadding(Math.max(0, pad));
  }, []);

  useEffect(() => {
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, [updatePadding, resolvedItems.length]);

  const getClosestIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return 0;
    const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    return closest;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setActiveIndex(getClosestIndex());
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [getClosestIndex]);

  const scrollTo = (index: number) => {
    const card = cardRefs.current[index];
    const container = scrollRef.current;
    if (!card || !container) return;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const containerWidth = container.offsetWidth;
    const scrollTarget = cardLeft - (containerWidth - cardWidth) / 2;
    container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
  };

  const prev = () => scrollTo(Math.max(0, activeIndex - 1));
  const next = () => scrollTo(Math.min(resolvedItems.length - 1, activeIndex + 1));

  if (resolvedItems.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-shefel-red text-xl">
          אין פוסטים להצגה
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 hide-scrollbar"
        style={{ direction: 'ltr', paddingLeft: sidePadding, paddingRight: sidePadding }}
      >
        {resolvedItems.map((item, index) => {
          const isActive = index === activeIndex;
          const key = item.type === 'post' ? item.data.id : item.data.id;
          return (
            <div
              key={key}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="snap-center shrink-0 w-[70vw] sm:w-[55vw] md:w-[40vw] lg:w-[30vw] max-w-[400px]"
              style={{
                transform: isActive ? 'scale(1)' : 'scale(0.85)',
                opacity: isActive ? 1 : 0.5,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
              }}
            >
              {item.type === 'post' ? (
                <PostCard post={item.data} tagsMap={tagsMap} />
              ) : (
                <MediaCarouselCard item={item.data} tagsMap={tagsMap} />
              )}
            </div>
          );
        })}
      </div>

      {/* Arrow buttons */}
      {resolvedItems.length > 1 && (
        <>
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="absolute top-1/2 right-1 md:right-[-20px] -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-shefel-red/80 md:bg-shefel-red text-shefel-yellow font-bold text-lg md:text-xl hover:bg-shefel-black transition-colors disabled:opacity-0 z-10"
            aria-label="הקודם"
          >
            ›
          </button>
          <button
            onClick={next}
            disabled={activeIndex === resolvedItems.length - 1}
            className="absolute top-1/2 left-1 md:left-[-20px] -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-shefel-red/80 md:bg-shefel-red text-shefel-yellow font-bold text-lg md:text-xl hover:bg-shefel-black transition-colors disabled:opacity-0 z-10"
            aria-label="הבא"
          >
            ‹
          </button>
        </>
      )}

      {/* Counter + dots */}
      {resolvedItems.length > 1 && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <p className="font-body font-bold text-shefel-red text-sm" style={{ direction: 'ltr' }}>
            {activeIndex + 1} / {resolvedItems.length}
          </p>
          <div className="flex gap-2">
            {resolvedItems.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? 'bg-shefel-red scale-125'
                    : 'bg-shefel-red/30 hover:bg-shefel-red/60'
                }`}
                aria-label={`תוכן ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
