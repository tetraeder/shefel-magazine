import { useState } from 'react';
import { collection, addDoc, writeBatch, doc, getDocs, Timestamp } from 'firebase/firestore';
import { getAppDb, getAppAuth } from '../../firebase';

const daysAgo = (d: number) => Timestamp.fromMillis(Date.now() - d * 86400000);
const now = Timestamp.now();

const TAGS = [
  { name: 'ליגת העל', slug: 'ligat-haal', color: null },
  { name: 'גולים', slug: 'goals', color: null },
  { name: 'הייליטים', slug: 'highlights', color: null },
  { name: 'כדורגל ישראלי', slug: 'israeli-football', color: null },
];

function makeIssues() {
  return [
    {
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
}

function makePosts(tagIds: Record<string, string>, issueId: string) {
  return [
    {
      imageUrl: 'https://picsum.photos/seed/shefel1/600/600',
      caption: 'רגע מטורף מהמשחק! הכדור עף לרשת ואין מה לעשות — פשוט גול עולמי. הקהל קפץ מהכיסאות.',
      captionSnippet: 'רגע מטורף מהמשחק! הכדור עף לרשת...',
      author: '@israeli_football',
      instagramUrl: 'https://www.instagram.com/reel/DVFzRhRCiBb/',
      tags: [tagIds['ligat-haal'], tagIds['goals'], tagIds['israeli-football']],
      issueId,
      order: 1,
      source: 'manual',
      publishedAt: daysAgo(2),
      createdAt: now,
      updatedAt: now,
    },
    {
      imageUrl: 'https://picsum.photos/seed/shefel2/600/600',
      caption: 'סיכום המחזור — כל הגולים, כל הרגעים הגדולים. אי אפשר להפסיק לצפות בזה שוב ושוב.',
      captionSnippet: 'סיכום המחזור — כל הגולים, כל הרגעים...',
      author: '@goals_il',
      instagramUrl: 'https://www.instagram.com/reel/DVaZokAimIq/',
      tags: [tagIds['goals'], tagIds['highlights']],
      issueId,
      order: 2,
      source: 'manual',
      publishedAt: daysAgo(5),
      createdAt: now,
      updatedAt: now,
    },
    {
      imageUrl: 'https://picsum.photos/seed/shefel3/600/600',
      caption: 'הייליט של השבוע! מהלך קומבינטיבי מטורף שהסתיים בגול. ככה משחקים כדורגל שפל.',
      captionSnippet: 'הייליט של השבוע! מהלך קומבינטיבי מטורף...',
      author: '@shefel_highlights',
      instagramUrl: 'https://www.instagram.com/reel/DVDaZXvCuaP/',
      tags: [tagIds['ligat-haal'], tagIds['highlights'], tagIds['israeli-football']],
      issueId,
      order: 3,
      source: 'manual',
      publishedAt: daysAgo(10),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function makeMedia(tagIds: Record<string, string>) {
  return [
    {
      title: 'ערן לוי — אגדת כדורגל',
      mediaOriginUrl:
        'https://res.cloudinary.com/dsheksfdb/video/upload/v1771839186/%D7%A2%D7%A8%D7%9F_%D7%9C%D7%95%D7%99_%D7%90%D7%92%D7%93%D7%AA_%D7%9B%D7%93%D7%95%D7%A8%D7%92%D7%9C_1_lt2fqn.mp4',
      thumbnailUrl:
        'https://res.cloudinary.com/dsheksfdb/video/upload/so_0/v1771839186/%D7%A2%D7%A8%D7%9F_%D7%9C%D7%95%D7%99_%D7%90%D7%92%D7%93%D7%AA_%D7%9B%D7%93%D7%95%D7%A8%D7%92%D7%9C_1_lt2fqn.jpg',
      tags: [tagIds['ligat-haal'], tagIds['israeli-football']],
      order: 1,
      publishedAt: daysAgo(1),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'כפס 1928 — עירוני אשדוד',
      mediaOriginUrl:
        'https://res.cloudinary.com/dsheksfdb/video/upload/v1771839212/%D7%9B%D7%A4%D7%A1_1928_%D7%A2%D7%99%D7%A8%D7%95%D7%A0%D7%99_%D7%90%D7%A9%D7%93%D7%95%D7%93_mgyu88.mp4',
      thumbnailUrl:
        'https://res.cloudinary.com/dsheksfdb/video/upload/so_0/v1771839212/%D7%9B%D7%A4%D7%A1_1928_%D7%A2%D7%99%D7%A8%D7%95%D7%A0%D7%99_%D7%90%D7%A9%D7%93%D7%95%D7%93_mgyu88.jpg',
      tags: [tagIds['israeli-football']],
      order: 2,
      publishedAt: daysAgo(7),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  function addLog(msg: string) {
    setLog((prev) => [...prev, msg]);
  }

  async function clearCollection(name: string) {
    const snapshot = await getDocs(collection(getAppDb(), name));
    if (snapshot.empty) return;
    const batch = writeBatch(getAppDb());
    snapshot.docs.forEach((d) => batch.delete(doc(getAppDb(), name, d.id)));
    await batch.commit();
    addLog(`  cleared ${snapshot.size} docs from "${name}"`);
  }

  async function runSeed() {
    setRunning(true);
    setLog([]);
    try {
      const auth = getAppAuth();
      const user = auth.currentUser;
      addLog(`Auth user: ${user ? user.email : 'NOT SIGNED IN'}`);
      if (!user) {
        addLog('ERROR: No authenticated user. Please log in first.');
        setRunning(false);
        return;
      }

      const db = getAppDb();

      // 1. Clear existing data
      addLog('Clearing existing data...');
      for (const col of ['tags', 'issues', 'posts', 'media']) {
        await clearCollection(col);
      }

      // 2. Seed tags
      addLog('Seeding tags...');
      const tagIds: Record<string, string> = {};
      for (const tag of TAGS) {
        const ref = await addDoc(collection(db, 'tags'), {
          ...tag,
          postCount: 0,
          createdAt: now,
        });
        tagIds[tag.slug] = ref.id;
        addLog(`  tag "${tag.name}" → ${ref.id}`);
      }

      // 3. Seed issues
      addLog('Seeding issues...');
      const issues = makeIssues();
      const issueIds: string[] = [];
      for (const issue of issues) {
        const ref = await addDoc(collection(db, 'issues'), issue);
        issueIds.push(ref.id);
        addLog(`  issue "${issue.title}" → ${ref.id}`);
      }

      // 4. Seed posts (linked to first issue)
      addLog('Seeding posts...');
      const posts = makePosts(tagIds, issueIds[0]);
      for (const post of posts) {
        const ref = await addDoc(collection(db, 'posts'), post);
        addLog(`  post "${post.captionSnippet}" → ${ref.id}`);
      }

      // 5. Seed media
      addLog('Seeding media...');
      const mediaItems = makeMedia(tagIds);
      for (const item of mediaItems) {
        const ref = await addDoc(collection(db, 'media'), item);
        addLog(`  media "${item.title}" → ${ref.id}`);
      }

      addLog('Done! All data seeded successfully.');
    } catch (err) {
      addLog(`ERROR: ${err}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <h1 className="font-black text-shefel-black text-3xl mb-6">Seed Data</h1>
      <p className="text-shefel-black mb-4">
        This will <strong>clear all existing data</strong> and seed the database with mock data (tags, issues, posts, media).
      </p>
      <button
        onClick={runSeed}
        disabled={running}
        className="bg-shefel-red text-shefel-white font-bold px-6 py-3 rounded hover:bg-shefel-black transition-colors disabled:opacity-50"
      >
        {running ? 'Seeding...' : 'Seed Database'}
      </button>
      {log.length > 0 && (
        <pre className="mt-6 bg-shefel-black text-shefel-white p-4 rounded text-base font-mono overflow-auto max-h-96 whitespace-pre-wrap" dir="ltr">
          {log.join('\n')}
        </pre>
      )}
    </div>
  );
}
