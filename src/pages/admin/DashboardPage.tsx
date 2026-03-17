import { useAllPosts } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { useIssues } from '../../hooks/useIssues';
import { Spinner } from '../../components/ui/Spinner';

export function DashboardPage() {
  const { posts, loading: postsLoading } = useAllPosts();
  const { tags, loading: tagsLoading } = useTags();
  const { issues, loading: issuesLoading } = useIssues();

  if (postsLoading || tagsLoading || issuesLoading) return <Spinner />;

  const stats = [
    { label: 'פוסטים', value: posts.length },
    { label: 'תגיות', value: tags.length },
    { label: 'גיליונות', value: issues.length },
  ];

  return (
    <div>
      <h1 className="font-black text-shefel-black text-3xl mb-6">
        דשבורד
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-shefel-white rounded-lg border-2 border-shefel-red p-6 text-center"
          >
            <p className="font-black text-shefel-red text-4xl">
              {stat.value}
            </p>
            <p className="text-shefel-black text-base mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
