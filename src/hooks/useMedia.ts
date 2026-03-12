import { useEffect, useState, useCallback } from 'react';
import type { MediaItem } from '../types/media';
import { getAllMedia } from '../services/media';
import { isMockMode, MOCK_MEDIA } from '../lib/mockData';

export function useMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    if (isMockMode()) {
      setMedia(MOCK_MEDIA);
      setLoading(false);
      return;
    }
    getAllMedia()
      .then(setMedia)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { media, loading, error, refetch };
}
