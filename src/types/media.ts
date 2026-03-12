import { Timestamp } from 'firebase/firestore';

export interface MediaItem {
  id: string;
  title: string;
  cloudinaryUrl: string;
  thumbnailUrl: string;
  tags: string[];
  issueId: string;
  order: number;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type MediaFormData = Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  publishedAt: string;
};
