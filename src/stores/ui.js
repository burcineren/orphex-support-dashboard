import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  // ========================================
  // STATE
  // ========================================
  const activeView = ref("list"); // 'list' | 'chart'
  const selectedRequestId = ref(null);
  const isDetailModalOpen = ref(false);
  const isSidebarOpen = ref(true);

  // ========================================
  // GETTERS
  // ========================================
  const isListView = () => activeView.value === "list";
  const isChartView = () => activeView.value === "chart";

  // ========================================
  // ACTIONS
  // ========================================

  /**
   * Set active view
   */
  const setActiveView = (view) => {
    if (view === "list" || view === "chart") {
      activeView.value = view;
    }
  };

  /**
   * Toggle between list and chart view
   */
  const toggleView = () => {
    activeView.value = activeView.value === "list" ? "chart" : "list";
  };

  /**
   * Open detail modal for a request
   */
  const openDetail = (requestId) => {
    selectedRequestId.value = requestId;
    isDetailModalOpen.value = true;
  };

  /**
   * Close detail modal
   */
  const closeDetail = () => {
    isDetailModalOpen.value = false;
    // Delay clearing selectedRequestId for smooth animation
    setTimeout(() => {
      selectedRequestId.value = null;
    }, 300);
  };

  /**
   * Toggle sidebar
   */
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  return {
    // State
    activeView,
    selectedRequestId,
    isDetailModalOpen,
    isSidebarOpen,

    // Getters
    isListView,
    isChartView,

    // Actions
    setActiveView,
    toggleView,
    openDetail,
    closeDetail,
    toggleSidebar,
  };
});
