import  apiClient  from '@/lib/interceptor'

export const serverService = {
  getServers: async () => {
    const response = await apiClient.get('/servers');
    return response.data;
  },
  getServer: async (id: string) => {
    const response = await apiClient.get(`/servers/${id}`);
    return response.data;
  },
  restartServer: async (id: string) => {
    const response = await apiClient.post(`/servers/${id}/restart`);
    return response.data;
  },
};