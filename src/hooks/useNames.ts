import { useEffect, useState, useCallback } from 'react';
import type { NameEntry } from '../services/names';
import { getAllNames } from '../services/names';

export function useNames() {
  const [names, setNames] = useState<NameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    getAllNames()
      .then(setNames)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { names, loading, error, refetch };
}
