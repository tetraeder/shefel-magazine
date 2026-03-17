import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  writeBatch,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^(\w+)=(.*)$/);
  if (match) env[match[1]] = match[2];
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const now = Timestamp.now();
const daysAgo = (d) => Timestamp.fromMillis(Date.now() - d * 86400000);

const HEBREW_MONTHS = [
  '', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

async function clearCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  if (snapshot.empty) return;
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(doc(db, name, d.id)));
  await batch.commit();
  console.log(`  cleared ${snapshot.size} docs from "${name}"`);
}

async function seed() {
  console.log('=== Seeding Firebase (shefelstudio) ===\n');

  // 1. Clear
  console.log('Clearing existing data...');
  for (const col of ['tags', 'issues', 'posts', 'media']) {
    await clearCollection(col);
  }

  // 2. Tags
  console.log('\nSeeding tags...');
  const TAGS = [
    { name: 'ליגת העל', slug: 'ligat-haal', color: null },
    { name: 'גולים', slug: 'goals', color: null },
    { name: 'הייליטים', slug: 'highlights', color: null },
    { name: 'כדורגל ישראלי', slug: 'israeli-football', color: null },
  ];
  const tagIds = {};
  for (const tag of TAGS) {
    const ref = await addDoc(collection(db, 'tags'), {
      ...tag,
      postCount: 0,
      createdAt: now,
    });
    tagIds[tag.slug] = ref.id;
    console.log(`  tag "${tag.name}" → ${ref.id}`);
  }

  // 3. Issues
  console.log('\nSeeding issues...');
  const issues = [
    {
      month: 3,
      year: 2026,
      title: 'גיליון מרץ 2026',
      description: `מיטב כדורגל שפל לחודש ${HEBREW_MONTHS[3]}`,
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
      description: `מיטב כדורגל שפל לחודש ${HEBREW_MONTHS[2]}`,
      isCurrent: false,
      postCount: 0,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];
  const issueIds = [];
  for (const issue of issues) {
    const ref = await addDoc(collection(db, 'issues'), issue);
    issueIds.push(ref.id);
    console.log(`  issue "${issue.title}" → ${ref.id}`);
  }

  // 4. Posts (linked to March issue)
  console.log('\nSeeding posts...');
  const posts = [
    {
      imageUrl: 'https://picsum.photos/seed/shefel1/600/600',
      caption: 'רגע מטורף מהמשחק! הכדור עף לרשת ואין מה לעשות — פשוט גול עולמי. הקהל קפץ מהכיסאות.',
      captionSnippet: 'רגע מטורף מהמשחק! הכדור עף לרשת...',
      author: '@israeli_football',
      instagramUrl: 'https://www.instagram.com/reel/DVFzRhRCiBb/',
      tags: [tagIds['ligat-haal'], tagIds['goals'], tagIds['israeli-football']],
      issueId: issueIds[0],
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
      issueId: issueIds[0],
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
      issueId: issueIds[0],
      order: 3,
      source: 'manual',
      publishedAt: daysAgo(10),
      createdAt: now,
      updatedAt: now,
    },
  ];
  for (const post of posts) {
    const ref = await addDoc(collection(db, 'posts'), post);
    console.log(`  post "${post.captionSnippet}" → ${ref.id}`);
  }

  // 5. Media
  console.log('\nSeeding media...');
  const mediaItems = [
    {
      title: 'ערן לוי — אגדת כדורגל',
      cloudinaryUrl:
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
      cloudinaryUrl:
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
  for (const item of mediaItems) {
    const ref = await addDoc(collection(db, 'media'), item);
    console.log(`  media "${item.title}" → ${ref.id}`);
  }

  console.log('\n=== Done! ===');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
