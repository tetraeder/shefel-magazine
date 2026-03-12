import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import type { Issue } from '../../types/issue';
import type { Tag } from '../../types/tag';
import { getIssueByDate } from '../../services/issues';
import { usePostsByIssue } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { IssueHeader } from '../../components/magazine/IssueHeader';
import { PostGrid } from '../../components/magazine/PostGrid';
import { Spinner } from '../../components/ui/Spinner';
import { isMockMode, MOCK_ISSUES } from '../../lib/mockData';

export function IssuePage() {
  const { year, month } = useParams<{ year: string; month: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!year || !month) return;
    setLoading(true);
    if (isMockMode()) {
      setIssue(
        MOCK_ISSUES.find((i) => i.year === Number(year) && i.month === Number(month)) || null
      );
      setLoading(false);
      return;
    }
    getIssueByDate(Number(year), Number(month))
      .then(setIssue)
      .finally(() => setLoading(false));
  }, [year, month]);

  const { posts, loading: postsLoading } = usePostsByIssue(issue?.id);
  const { tags } = useTags();

  const tagsMap = useMemo(() => {
    const map: Record<string, Tag> = {};
    tags.forEach((t) => { map[t.id] = t; });
    return map;
  }, [tags]);

  if (loading || postsLoading) return <Spinner />;

  if (!issue) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-shefel-red text-xl">
          גיליון לא נמצא
        </p>
      </div>
    );
  }

  return (
    <>
      <IssueHeader month={issue.month} year={issue.year} title={issue.title} />
      <PostGrid posts={posts} tagsMap={tagsMap} />
    </>
  );
}
