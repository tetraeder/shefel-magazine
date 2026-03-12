import { Link } from 'react-router-dom';
import type { Issue } from '../../types/issue';
import { formatIssueDate } from '../../lib/date';

interface ArchiveListProps {
  issues: Issue[];
}

export function ArchiveList({ issues }: ArchiveListProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-shefel-red text-xl">
          אין גיליונות בארכיון
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <Link
          key={issue.id}
          to={`/issue/${issue.year}/${issue.month}`}
          className="block bg-shefel-red rounded-lg border-4 border-shefel-red p-6
            hover:bg-shefel-yellow transition-colors no-underline group"
        >
          <h3 className="font-display font-black text-2xl text-shefel-yellow group-hover:text-shefel-red mb-1">
            {formatIssueDate(issue.month, issue.year)}
          </h3>
          {issue.title && (
            <p className="font-body text-shefel-yellow group-hover:text-shefel-red text-sm">
              {issue.title}
            </p>
          )}
          <p className="font-body text-shefel-yellow group-hover:text-shefel-red text-xs mt-2">
            {issue.postCount} פוסטים
          </p>
        </Link>
      ))}
    </div>
  );
}
