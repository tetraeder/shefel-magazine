import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  captionSnippet: string;
  author: string;
  instagramUrl: string | null;
  tags: string[];
  issueId: string;
  order: number;
  source: 'manual' | 'oembed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PostFormData = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
