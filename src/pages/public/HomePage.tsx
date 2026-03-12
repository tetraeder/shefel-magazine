import { useCurrentIssue } from '../../hooks/useCurrentIssue';
import { usePostsByIssue } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { useIssues } from '../../hooks/useIssues';
import { IssueHeader } from '../../components/magazine/IssueHeader';
import { PostGrid } from '../../components/magazine/PostGrid';
import { ArchiveList } from '../../components/magazine/ArchiveList';
import { Spinner } from '../../components/ui/Spinner';
import { useMemo } from 'react';
import type { Tag } from '../../types/tag';

export function HomePage() {
  const { issue, loading: issueLoading } = useCurrentIssue();
  const { posts, loading: postsLoading } = usePostsByIssue(issue?.id);
  const { tags } = useTags();
  const { issues } = useIssues();

  const tagsMap = useMemo(() => {
    const map: Record<string, Tag> = {};
    tags.forEach((t) => { map[t.id] = t; });
    return map;
  }, [tags]);

  const pastIssues = useMemo(
    () => issues.filter((i) => i.id !== issue?.id),
    [issues, issue]
  );

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
      <IssueHeader month={issue.month} year={issue.year} title={issue.title} showArchiveLink={pastIssues.length > 0} />
      <PostGrid posts={posts} tagsMap={tagsMap} />

      {pastIssues.length > 0 && (
        <section id="archive" className="mt-16">
          <h2 className="font-display font-black text-shefel-red text-3xl text-center mb-6">
            גיליונות קודמים
          </h2>
          <ArchiveList issues={pastIssues} />
        </section>
      )}
    </>
  );
}
