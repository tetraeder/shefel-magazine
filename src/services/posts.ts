import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getAppDb } from '../firebase';
import type { Post, PostFormData } from '../types/post';

const COLLECTION = 'posts';

export async function getPostsByIssue(issueId: string): Promise<Post[]> {
  const q = query(
    collection(getAppDb(), COLLECTION),
    where('issueId', '==', issueId)
  );
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
  return posts.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getPostsByTag(tagId: string): Promise<Post[]> {
  const q = query(
    collection(getAppDb(), COLLECTION),
    where('tags', 'array-contains', tagId)
  );
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
  return posts.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function getAllPosts(): Promise<Post[]> {
  const snapshot = await getDocs(collection(getAppDb(), COLLECTION));
  const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
  return posts.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function getPost(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(getAppDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Post;
}

export async function createPost(data: PostFormData): Promise<string> {
  const { publishedAt, ...rest } = data;
  const docRef = await addDoc(collection(getAppDb(), COLLECTION), {
    ...rest,
    publishedAt: publishedAt ? Timestamp.fromDate(new Date(publishedAt)) : null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updatePost(id: string, data: Partial<PostFormData>): Promise<void> {
  const { publishedAt, ...rest } = data;
  await updateDoc(doc(getAppDb(), COLLECTION, id), {
    ...rest,
    ...(publishedAt !== undefined
      ? { publishedAt: publishedAt ? Timestamp.fromDate(new Date(publishedAt)) : null }
      : {}),
    updatedAt: Timestamp.now(),
  });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(getAppDb(), COLLECTION, id));
}
