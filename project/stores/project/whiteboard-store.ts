// Whiteboard Zustand store
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface WhiteboardState {
  persistenceKey: string;
}

export const useWhiteboardStore = create<WhiteboardState>()(
  devtools(() => ({
    persistenceKey:  project-srg-whiteboard,
  }))
);
