import { useEffect, useState, useCallback } from 'react';
import type { Tag } from '../types/tag';
import { getAllTags } from '../services/tags';
import { isMockMode, MOCK_TAGS } from '../lib/mockData';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    if (isMockMode()) {
      setTags(MOCK_TAGS);
      setLoading(false);
      return;
    }
    getAllTags()
      .then(setTags)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { tags, loading, error, refetch };
}
