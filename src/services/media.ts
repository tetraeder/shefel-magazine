import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getAppDb } from '../firebase';
import type { MediaItem, MediaFormData } from '../types/media';

const COLLECTION = 'media';

// Map old Firestore field name (cloudinaryUrl) to new one (mediaOriginUrl)
function mapDoc(d: { id: string; data: () => Record<string, unknown> }): MediaItem {
  const raw = d.data();
  if (!raw.mediaOriginUrl && raw.cloudinaryUrl) {
    raw.mediaOriginUrl = raw.cloudinaryUrl;
  }
  if (!raw.credits) raw.credits = '';
  return { id: d.id, ...raw } as MediaItem;
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const snapshot = await getDocs(collection(getAppDb(), COLLECTION));
  const items = snapshot.docs.map(mapDoc);
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getMediaByIssue(issueId: string): Promise<MediaItem[]> {
  const q = query(
    collection(getAppDb(), COLLECTION),
    where('issueId', '==', issueId)
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(mapDoc);
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getMediaByTag(tagId: string): Promise<MediaItem[]> {
  const q = query(
    collection(getAppDb(), COLLECTION),
    where('tags', 'array-contains', tagId)
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(mapDoc);
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
