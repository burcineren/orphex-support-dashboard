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

  const setActiveView = (view) => {
    if (view === "list" || view === "chart") {
      activeView.value = view;
    }
  };

  const toggleView = () => {
    activeView.value = activeView.value === "list" ? "chart" : "list";
  };

  const openDetail = (requestId) => {
    selectedRequestId.value = requestId;
    isDetailModalOpen.value = true;
  };

  const closeDetail = () => {
    isDetailModalOpen.value = false;
    setTimeout(() => {
      selectedRequestId.value = null;
    }, 300);
  };

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
