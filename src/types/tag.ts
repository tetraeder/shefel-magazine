import { Timestamp } from 'firebase/firestore';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  postCount: number;
  createdAt: Timestamp;
}

export type TagFormData = Omit<Tag, 'id' | 'createdAt' | 'postCount'>;
