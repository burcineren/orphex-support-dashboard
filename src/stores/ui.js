import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  // ========================================
  // STATE
  // ========================================
  const activeView = ref('list'); // 'list' | 'chart'
  const isSidebarOpen = ref(true);

  // ========================================
  // GETTERS
  // ========================================
  const isListView = () => activeView.value === 'list';
  const isChartView = () => activeView.value === 'chart';

  // ========================================
  // ACTIONS
  // ========================================

  const setActiveView = (view) => {
    if (view === 'list' || view === 'chart') {
      activeView.value = view;
    }
  };

  const toggleView = () => {
    activeView.value = activeView.value === 'list' ? 'chart' : 'list';
  };

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  return {
    // State
    activeView,
    isSidebarOpen,

    // Getters
    isListView,
    isChartView,

    // Actions
    setActiveView,
    toggleView,
    toggleSidebar,
  };
});
