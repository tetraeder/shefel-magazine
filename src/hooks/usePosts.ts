import { useEffect, useState, useCallback } from 'react';
import type { Post } from '../types/post';
import { getPostsByIssue, getPostsByTag, getAllPosts } from '../services/posts';
import { isMockMode, MOCK_POSTS } from '../lib/mockData';

export function usePostsByIssue(issueId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!issueId) return;
    setLoading(true);
    if (isMockMode()) {
      setPosts(MOCK_POSTS.filter((p) => p.issueId === issueId));
      setLoading(false);
      return;
    }
    getPostsByIssue(issueId)
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [issueId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { posts, loading, error, refetch };
}

export function usePostsByTag(tagId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tagId) return;
    setLoading(true);
    if (isMockMode()) {
      setPosts(MOCK_POSTS.filter((p) => p.tags.includes(tagId)));
      setLoading(false);
      return;
    }
    getPostsByTag(tagId)
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tagId]);

  return { posts, loading, error };
}

export function useAllPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    if (isMockMode()) {
      setPosts(MOCK_POSTS);
      setLoading(false);
      return;
    }
    getAllPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { posts, loading, error, refetch };
}
