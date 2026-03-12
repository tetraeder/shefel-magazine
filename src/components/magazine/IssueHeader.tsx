interface IssueHeaderProps {
  month: number;
  year: number;
  title?: string;
  showArchiveLink?: boolean;
}

export function IssueHeader({ title, showArchiveLink }: IssueHeaderProps) {
  const scrollToArchive = () => {
    document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mb-8 text-center">
      {title && (
        <h1 className="font-display font-black text-shefel-red text-5xl mb-2">
          {title}
        </h1>
      )}
      {showArchiveLink && (
        <button
          onClick={scrollToArchive}
          className="font-body font-bold text-shefel-red hover:text-shefel-black transition-colors cursor-pointer text-lg bg-transparent border-none"
        >
          לגיליונות קודמים ↓
        </button>
      )}
    </div>
  );
}
