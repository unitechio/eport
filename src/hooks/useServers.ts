import { useState, useEffect } from 'react';
import { serverService } from '@/services/serverService';

export function useServers() {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data = await serverService.getServers();
        setServers(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  return { servers, isLoading, error };
}
