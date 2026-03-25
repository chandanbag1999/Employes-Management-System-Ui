import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/store/uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset the store state
    useUIStore.setState({
      sidebarCollapsed: false,
      darkMode: true,
    });
  });

  describe('initial state', () => {
    it('should have sidebar not collapsed initially', () => {
      const state = useUIStore.getState();
      expect(state.sidebarCollapsed).toBe(false);
    });

    it('should have dark mode enabled initially', () => {
      const state = useUIStore.getState();
      expect(state.darkMode).toBe(true);
    });
  });

  describe('sidebar', () => {
    it('should toggle sidebar collapsed', () => {
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);
      
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    });

    it('should set sidebar collapsed', () => {
      useUIStore.getState().setSidebarCollapsed(true);
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);
      
      useUIStore.getState().setSidebarCollapsed(false);
      expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    });
  });

  describe('dark mode', () => {
    it('should toggle dark mode', () => {
      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().darkMode).toBe(false);
      
      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().darkMode).toBe(true);
    });
  });
});