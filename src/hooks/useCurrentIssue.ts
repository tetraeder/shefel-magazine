import { useEffect, useState } from 'react';
import type { Issue } from '../types/issue';
import { getCurrentIssue } from '../services/issues';
import { isMockMode, MOCK_ISSUES } from '../lib/mockData';

export function useCurrentIssue() {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMockMode()) {
      setIssue(MOCK_ISSUES.find((i) => i.isCurrent) || null);
      setLoading(false);
      return;
    }
    getCurrentIssue()
      .then(setIssue)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { issue, loading, error };
}
