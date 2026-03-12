import { Link } from 'react-router-dom';
import type { Tag } from '../../types/tag';

interface TagChipProps {
  tag: Tag;
}

export function TagChip({ tag }: TagChipProps) {
  return (
    <Link
      to={`/tag/${tag.slug}`}
      className="inline-block px-3 py-1 text-sm font-bold rounded-full
        bg-shefel-red text-shefel-yellow border-2 border-shefel-yellow
        hover:bg-shefel-black transition-colors no-underline"
    >
      {tag.name}
    </Link>
  );
}
