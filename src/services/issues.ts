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
  writeBatch,
} from 'firebase/firestore';
import { getAppDb } from '../firebase';
import type { Issue, IssueFormData } from '../types/issue';

const COLLECTION = 'issues';

export async function getAllIssues(): Promise<Issue[]> {
  const snapshot = await getDocs(collection(getAppDb(), COLLECTION));
  const issues = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Issue));
  return issues.sort((a, b) => b.year - a.year || b.month - a.month);
}

export async function getCurrentIssue(): Promise<Issue | null> {
  const q = query(collection(getAppDb(), COLLECTION), where('isCurrent', '==', true));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Issue;
}

export async function getIssue(id: string): Promise<Issue | null> {
  const snap = await getDoc(doc(getAppDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Issue;
}

export async function getIssueByDate(year: number, month: number): Promise<Issue | null> {
  const q = query(
    collection(getAppDb(), COLLECTION),
    where('year', '==', year),
    where('month', '==', month)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Issue;
}

export async function createIssue(data: IssueFormData): Promise<string> {
  const docRef = await addDoc(collection(getAppDb(), COLLECTION), {
    ...data,
    postCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateIssue(id: string, data: Partial<IssueFormData>): Promise<void> {
  await updateDoc(doc(getAppDb(), COLLECTION, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function setCurrentIssue(newCurrentId: string): Promise<void> {
  const currentIssue = await getCurrentIssue();
  const batch = writeBatch(getAppDb());

  if (currentIssue) {
    batch.update(doc(getAppDb(), COLLECTION, currentIssue.id), { isCurrent: false });
  }
  batch.update(doc(getAppDb(), COLLECTION, newCurrentId), { isCurrent: true });

  await batch.commit();
}

export async function deleteIssue(id: string): Promise<void> {
  await deleteDoc(doc(getAppDb(), COLLECTION, id));
}
