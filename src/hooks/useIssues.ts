import { useEffect, useState, useCallback } from 'react';
import type { Issue } from '../types/issue';
import { getAllIssues } from '../services/issues';
import { isMockMode, MOCK_ISSUES } from '../lib/mockData';

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    if (isMockMode()) {
      setIssues(MOCK_ISSUES);
      setLoading(false);
      return;
    }
    getAllIssues()
      .then(setIssues)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { issues, loading, error, refetch };
}
