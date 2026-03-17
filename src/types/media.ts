import { Timestamp } from 'firebase/firestore';

export interface MediaItem {
  id: string;
  title: string;
  mediaOriginUrl: string;
  thumbnailUrl: string;
  tags: string[];
  issueId: string;
  credits: string;
  order: number;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type MediaFormData = Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  publishedAt: string;
};
