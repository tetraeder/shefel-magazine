import { useCurrentIssue } from '../../hooks/useCurrentIssue';
import { usePostsByIssue } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { IssueHeader } from '../../components/magazine/IssueHeader';
import { PostGrid } from '../../components/magazine/PostGrid';
import { Spinner } from '../../components/ui/Spinner';
import { useMemo } from 'react';
import type { Tag } from '../../types/tag';

export function HomePage() {
  const { issue, loading: issueLoading } = useCurrentIssue();
  const { posts, loading: postsLoading } = usePostsByIssue(issue?.id);
  const { tags } = useTags();

  const tagsMap = useMemo(() => {
    const map: Record<string, Tag> = {};
    tags.forEach((t) => { map[t.id] = t; });
    return map;
  }, [tags]);

  if (issueLoading || postsLoading) return <Spinner />;

  if (!issue) {
    return (
      <div className="text-center py-16">
        <h1 className="font-display font-black text-shefel-red text-4xl mb-4">
          כדורגל שפל
        </h1>
        <p className="font-body text-shefel-black text-lg">
          הגיליון הראשון בדרך... חזרו בקרוב!
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
