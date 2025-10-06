export interface WebSocket {
  type: 'notification' | 'server_update' | 'container_event' | 'system_alert';
  payload: any;
  timestamp: string;
}
