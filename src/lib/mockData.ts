import { Timestamp } from 'firebase/firestore';
import type { Post } from '../types/post';
import type { Tag } from '../types/tag';
import type { Issue } from '../types/issue';
import type { MediaItem } from '../types/media';

const now = Timestamp.now();
const daysAgo = (d: number) => Timestamp.fromMillis(Date.now() - d * 86400000);

export const MOCK_TAGS: Tag[] = [
  { id: 'tag-1', name: 'ליגת העל', slug: 'ligat-haal', color: null, postCount: 2, createdAt: now },
  { id: 'tag-2', name: 'גולים', slug: 'goals', color: null, postCount: 3, createdAt: now },
  { id: 'tag-3', name: 'הייליטים', slug: 'highlights', color: null, postCount: 2, createdAt: now },
  { id: 'tag-4', name: 'כדורגל ישראלי', slug: 'israeli-football', color: null, postCount: 3, createdAt: now },
];

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'issue-march-2026',
    month: 3,
    year: 2026,
    title: 'גיליון מרץ 2026',
    description: 'כל מה שקורה במגרשים, בגובה העיניים',
    isCurrent: true,
    postCount: 3,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'issue-feb-2026',
    month: 2,
    year: 2026,
    title: 'גיליון פברואר 2026',
    description: '',
    isCurrent: false,
    postCount: 0,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    imageUrl: 'https://picsum.photos/seed/shefel1/600/600',
    caption: 'רגע מטורף מהמשחק! הכדור עף לרשת ואין מה לעשות — פשוט גול עולמי. הקהל קפץ מהכיסאות.',
    captionSnippet: 'רגע מטורף מהמשחק! הכדור עף לרשת...',
    author: '@israeli_football',
    instagramUrl: 'https://www.instagram.com/reel/DVFzRhRCiBb/',
    tags: ['tag-1', 'tag-2', 'tag-4'],
    issueId: 'issue-march-2026',
    order: 1,
    source: 'manual',
    publishedAt: daysAgo(2),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'post-2',
    imageUrl: 'https://picsum.photos/seed/shefel2/600/600',
    caption: 'סיכום המחזור — כל הגולים, כל הרגעים הגדולים. אי אפשר להפסיק לצפות בזה שוב ושוב.',
    captionSnippet: 'סיכום המחזור — כל הגולים, כל הרגעים...',
    author: '@goals_il',
    instagramUrl: 'https://www.instagram.com/reel/DVaZokAimIq/',
    tags: ['tag-2', 'tag-3'],
    issueId: 'issue-march-2026',
    order: 2,
    source: 'manual',
    publishedAt: daysAgo(5),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'post-3',
    imageUrl: 'https://picsum.photos/seed/shefel3/600/600',
    caption: 'הייליט של השבוע! מהלך קומבינטיבי מטורף שהסתיים בגול. ככה משחקים כדורגל שפל.',
    captionSnippet: 'הייליט של השבוע! מהלך קומבינטיבי מטורף...',
    author: '@shefel_highlights',
    instagramUrl: 'https://www.instagram.com/reel/DVDaZXvCuaP/',
    tags: ['tag-1', 'tag-3', 'tag-4'],
    issueId: 'issue-march-2026',
    order: 3,
    source: 'manual',
    publishedAt: daysAgo(10),
    createdAt: now,
    updatedAt: now,
  },
];

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    title: 'ערן לוי — אגדת כדורגל',
    cloudinaryUrl: 'https://res.cloudinary.com/dsheksfdb/video/upload/v1771839186/%D7%A2%D7%A8%D7%9F_%D7%9C%D7%95%D7%99_%D7%90%D7%92%D7%93%D7%AA_%D7%9B%D7%93%D7%95%D7%A8%D7%92%D7%9C_1_lt2fqn.mp4',
    thumbnailUrl: 'https://res.cloudinary.com/dsheksfdb/video/upload/so_0/v1771839186/%D7%A2%D7%A8%D7%9F_%D7%9C%D7%95%D7%99_%D7%90%D7%92%D7%93%D7%AA_%D7%9B%D7%93%D7%95%D7%A8%D7%92%D7%9C_1_lt2fqn.jpg',
    tags: ['tag-1', 'tag-4'],
    issueId: 'issue-1',
    order: 1,
    publishedAt: daysAgo(1),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'media-2',
    title: 'כפס 1928 — עירוני אשדוד',
    cloudinaryUrl: 'https://res.cloudinary.com/dsheksfdb/video/upload/v1771839212/%D7%9B%D7%A4%D7%A1_1928_%D7%A2%D7%99%D7%A8%D7%95%D7%A0%D7%99_%D7%90%D7%A9%D7%93%D7%95%D7%93_mgyu88.mp4',
    thumbnailUrl: 'https://res.cloudinary.com/dsheksfdb/video/upload/so_0/v1771839212/%D7%9B%D7%A4%D7%A1_1928_%D7%A2%D7%99%D7%A8%D7%95%D7%A0%D7%99_%D7%90%D7%A9%D7%93%D7%95%D7%93_mgyu88.jpg',
    tags: ['tag-4'],
    issueId: 'issue-1',
    order: 2,
    publishedAt: daysAgo(7),
    createdAt: now,
    updatedAt: now,
  },
];

export function isMockMode(): boolean {
  return !import.meta.env.VITE_FIREBASE_API_KEY;
}
