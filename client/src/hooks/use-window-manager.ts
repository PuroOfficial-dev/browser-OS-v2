import { create } from 'zustand';

export type AppId = 'terminal' | 'settings' | 'browser' | 'files' | 'calculator' | 'app-maker' | `custom-${number}`;

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

interface WindowManagerStore {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  
  openWindow: (appId: AppId, title: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
}

export const useWindowManager = create<WindowManagerStore>((set) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (appId, title) => set((state) => {
    // Check if app is already open (single instance policy for simplicity)
    const existing = state.windows.find(w => w.appId === appId);
    if (existing) {
      return {
        activeWindowId: existing.id,
        windows: state.windows.map(w => 
          w.id === existing.id 
            ? { ...w, isMinimized: false, zIndex: state.nextZIndex + 1 } 
            : w
        ),
        nextZIndex: state.nextZIndex + 1
      };
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      title,
      isMinimized: false,
      isMaximized: false,
      zIndex: state.nextZIndex + 1,
      // Default center-ish position
      position: { x: 100 + (state.windows.length * 20), y: 50 + (state.windows.length * 20) }, 
    };

    return {
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: state.nextZIndex + 1,
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter((w) => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),

  focusWindow: (id) => set((state) => {
    if (state.activeWindowId === id) return {};
    return {
      activeWindowId: id,
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.nextZIndex + 1, isMinimized: false } : w
      ),
      nextZIndex: state.nextZIndex + 1,
    };
  }),

  minimizeWindow: (id) => set((state) => ({
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: true } : w
    ),
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMaximized: true } : w
    ),
  })),

  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w
    ),
  })),
}));
