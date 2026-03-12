import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import type { Tag } from '../../types/tag';
import { getTagBySlug } from '../../services/tags';
import { usePostsByTag } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { PostGrid } from '../../components/magazine/PostGrid';
import { Spinner } from '../../components/ui/Spinner';
import { isMockMode, MOCK_TAGS } from '../../lib/mockData';

export function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);

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

  const tagsMap = useMemo(() => {
    const map: Record<string, Tag> = {};
    tags.forEach((t) => { map[t.id] = t; });
    return map;
  }, [tags]);

  if (loading || postsLoading) return <Spinner />;

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
      <div className="mb-8 text-center">
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
      <PostGrid posts={posts} tagsMap={tagsMap} />
    </>
  );
}
