import { wsClient } from '@/lib/socket';
import { useNotificationStore } from '@/store/notificationStore';

export const websocketService = {
  initialize: (token: string) => {
    wsClient.connect(token);

    wsClient.subscribe('notification', (notification) => {
      useNotificationStore.getState().addNotification(notification);
    });

    wsClient.subscribe('server_update', (server) => {
      // Handle server update events
      console.log('Server update:', server);
    });
  },
  disconnect: () => {
    wsClient.disconnect();
  },
};
