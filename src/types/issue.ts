import { Timestamp } from 'firebase/firestore';

export interface Issue {
  id: string;
  month: number;
  year: number;
  title: string;
  description: string;
  isCurrent: boolean;
  postCount: number;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type IssueFormData = Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'postCount'>;
