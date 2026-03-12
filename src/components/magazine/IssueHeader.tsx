import { formatIssueDate } from '../../lib/date';

interface IssueHeaderProps {
  month: number;
  year: number;
  title?: string;
}

export function IssueHeader({ month, year, title }: IssueHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="font-display font-black text-shefel-red text-5xl mb-2">
        {title || formatIssueDate(month, year)}
      </h1>
      {title && (
        <p className="font-body text-shefel-black text-lg">
          {formatIssueDate(month, year)}
        </p>
      )}
    </div>
  );
}
