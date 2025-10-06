import { useWebSocket } from '@/hooks/useWebSocket';

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket();

  return <>{children}</>;
}
