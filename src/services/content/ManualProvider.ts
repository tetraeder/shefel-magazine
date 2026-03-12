import type { Post } from '../../types/post';
import type { PostContent, CardRenderMode } from './ContentProvider';

export class ManualProvider {
  async getPostContent(post: Post): Promise<PostContent> {
    return {
      imageUrl: post.imageUrl,
      caption: post.caption,
      author: post.author,
      instagramUrl: post.instagramUrl,
    };
  }

  getRenderMode(content: PostContent): CardRenderMode {
    return { type: 'image', imageUrl: content.imageUrl };
  }
}
