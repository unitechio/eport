import { create } from 'zustand';

interface WebSocketState {
  isConnected: boolean;
  setConnected: (isConnected: boolean) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  isConnected: false,
  setConnected: (isConnected) => set({ isConnected }),
}));
