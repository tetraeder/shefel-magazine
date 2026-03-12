interface IssueHeaderProps {
  month: number;
  year: number;
  title?: string;
  description?: string;
  showArchiveLink?: boolean;
}

export function IssueHeader({ title, description, showArchiveLink }: IssueHeaderProps) {
  const scrollToArchive = () => {
    document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mb-4 text-center">
      {title && (
        <>
          <h1 className="font-display font-black text-shefel-red text-5xl mb-1">
            {title}
          </h1>
          {description && (
            <p className="font-body text-shefel-black text-base mb-2">
              {description}
            </p>
          )}
        </>
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
