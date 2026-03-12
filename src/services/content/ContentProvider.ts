import type { Post } from '../../types/post';

export interface PostContent {
  imageUrl: string;
  caption: string;
  author: string;
  instagramUrl: string | null;
  embedHtml?: string;
}

export type CardRenderMode =
  | { type: 'image'; imageUrl: string }
  | { type: 'embed'; html: string };

export interface ContentProvider {
  getPostContent(post: Post): Promise<PostContent>;
  getRenderMode(content: PostContent): CardRenderMode;
}
