import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getAppDb } from '../firebase';
import type { MediaItem, MediaFormData } from '../types/media';

const COLLECTION = 'media';

export async function getAllMedia(): Promise<MediaItem[]> {
  const q = query(collection(getAppDb(), COLLECTION), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MediaItem));
}

export async function getMediaByTag(tagId: string): Promise<MediaItem[]> {
  const q = query(
    collection(getAppDb(), COLLECTION),
    where('tags', 'array-contains', tagId),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MediaItem));
}

export async function createMedia(data: MediaFormData): Promise<string> {
  const { publishedAt, ...rest } = data;
  const docRef = await addDoc(collection(getAppDb(), COLLECTION), {
    ...rest,
    publishedAt: publishedAt ? Timestamp.fromDate(new Date(publishedAt)) : null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateMedia(id: string, data: Partial<MediaFormData>): Promise<void> {
  const { publishedAt, ...rest } = data;
  await updateDoc(doc(getAppDb(), COLLECTION, id), {
    ...rest,
    ...(publishedAt !== undefined
      ? { publishedAt: publishedAt ? Timestamp.fromDate(new Date(publishedAt)) : null }
      : {}),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteMedia(id: string): Promise<void> {
  await deleteDoc(doc(getAppDb(), COLLECTION, id));
}
