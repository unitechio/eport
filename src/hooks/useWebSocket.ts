import { useEffect } from 'react';
import { websocketService } from '@/services/websocketService';
import { useAuth } from '@/hooks/useAuth';

export function useWebSocket() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && localStorage.getItem('authToken')) {
      websocketService.initialize(localStorage.getItem('authToken')!);
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user]);
}
