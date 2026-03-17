import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { getAppDb } from '../firebase';

const COLLECTION = 'names';

export interface NameEntry {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export async function getAllNames(): Promise<NameEntry[]> {
  const snapshot = await getDocs(collection(getAppDb(), COLLECTION));
  const names = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NameEntry));
  names.sort((a, b) => a.name.localeCompare(b.name, 'he'));
  return names;
}

export async function createName(name: string): Promise<string> {
  const docRef = await addDoc(collection(getAppDb(), COLLECTION), {
    name,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateName(id: string, name: string): Promise<void> {
  await updateDoc(doc(getAppDb(), COLLECTION, id), { name });
}

export async function deleteName(id: string): Promise<void> {
  await deleteDoc(doc(getAppDb(), COLLECTION, id));
}

// --- Name Suggestions ---

const SUGGESTIONS_COLLECTION = 'nameSuggestions';

export interface NameSuggestion {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: Timestamp;
}

export async function getAllSuggestions(): Promise<NameSuggestion[]> {
  const snapshot = await getDocs(collection(getAppDb(), SUGGESTIONS_COLLECTION));
  const suggestions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NameSuggestion));
  suggestions.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
  return suggestions;
}

export async function createSuggestion(firstName: string, lastName: string): Promise<string> {
  const docRef = await addDoc(collection(getAppDb(), SUGGESTIONS_COLLECTION), {
    firstName,
    lastName,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteSuggestion(id: string): Promise<void> {
  await deleteDoc(doc(getAppDb(), SUGGESTIONS_COLLECTION, id));
}

export async function seedNames(names: string[]): Promise<void> {
  const db = getAppDb();
  // Firestore batches support max 500 operations
  for (let i = 0; i < names.length; i += 500) {
    const batch = writeBatch(db);
    const chunk = names.slice(i, i + 500);
    for (const name of chunk) {
      const ref = doc(collection(db, COLLECTION));
      batch.set(ref, { name, createdAt: Timestamp.now() });
    }
    await batch.commit();
  }
}
