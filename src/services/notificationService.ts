import  apiClient  from '@/lib/interceptor';

export const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },
};
