import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where,
  getDoc,
} from 'firebase/firestore';
import { getAppDb } from '../firebase';
import type { Tag, TagFormData } from '../types/tag';

const COLLECTION = 'tags';

export async function getAllTags(): Promise<Tag[]> {
  const q = query(collection(getAppDb(), COLLECTION), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Tag));
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const q = query(collection(getAppDb(), COLLECTION), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Tag;
}

export async function getTag(id: string): Promise<Tag | null> {
  const snap = await getDoc(doc(getAppDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Tag;
}

export async function createTag(data: TagFormData): Promise<string> {
  const docRef = await addDoc(collection(getAppDb(), COLLECTION), {
    ...data,
    postCount: 0,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateTag(id: string, data: Partial<TagFormData>): Promise<void> {
  await updateDoc(doc(getAppDb(), COLLECTION, id), data);
}

export async function deleteTag(id: string): Promise<void> {
  await deleteDoc(doc(getAppDb(), COLLECTION, id));
}
