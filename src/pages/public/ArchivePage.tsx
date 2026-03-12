import { useIssues } from '../../hooks/useIssues';
import { ArchiveList } from '../../components/magazine/ArchiveList';
import { Spinner } from '../../components/ui/Spinner';

export function ArchivePage() {
  const { issues, loading } = useIssues();

  if (loading) return <Spinner />;

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="font-display font-black text-shefel-red text-4xl">
          ארכיון גיליונות
        </h1>
      </div>
      <ArchiveList issues={issues} />
    </>
  );
}
