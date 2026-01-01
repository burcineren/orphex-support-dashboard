import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRequestsStore } from "./requests";
import { calculateNeedsAttention } from "../utils/dataUtils";

export const useFiltersStore = defineStore("filters", () => {
  // ========================================
  // STATE
  // ========================================
  const searchTerm = ref("");
  const statusFilter = ref("All");
  const priorityFilter = ref("All");
  const sortOrder = ref("newest");
  const showNeedsAttention = ref(false);

  // ========================================
  // GETTERS
  // ========================================

  /**
   * Get filtered and sorted requests
   */
  const filteredRequests = computed(() => {
    const requestsStore = useRequestsStore();
    let filtered = [...requestsStore.requests];

    // Search filter
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.customer.toLowerCase().includes(term) ||
          r.id.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter.value !== "All") {
      filtered = filtered.filter((r) => r.status === statusFilter.value);
    }

    // Priority filter
    if (priorityFilter.value !== "All") {
      filtered = filtered.filter((r) => r.priority === priorityFilter.value);
    }

    // Needs attention filter
    if (showNeedsAttention.value) {
      filtered = filtered.filter(
        (r) => calculateNeedsAttention(r).needsAttention
      );
    }

    // Sort (create new array to avoid mutation)
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder.value === "newest" ? dateB - dateA : dateA - dateB;
    });
  });

  const filteredCount = computed(() => filteredRequests.value.length);

  const hasActiveFilters = computed(() => {
    return (
      searchTerm.value !== "" ||
      statusFilter.value !== "All" ||
      priorityFilter.value !== "All" ||
      showNeedsAttention.value ||
      sortOrder.value !== "newest"
    );
  });

  const isEmpty = computed(() => {
    const requestsStore = useRequestsStore();
    return requestsStore.requests.length === 0 && !hasActiveFilters.value;
  });

  // ========================================
  // ACTIONS
  // ========================================

  /**
   * Set search term
   */
  const setSearch = (term) => {
    searchTerm.value = term;
  };

  /**
   * Set status filter
   */
  const setStatusFilter = (status) => {
    statusFilter.value = status;
  };

  /**
   * Set priority filter
   */
  const setPriorityFilter = (priority) => {
    priorityFilter.value = priority;
  };

  /**
   * Set sort order
   */
  const setSortOrder = (order) => {
    sortOrder.value = order;
  };

  /**
   * Toggle needs attention filter
   */
  const toggleNeedsAttention = () => {
    showNeedsAttention.value = !showNeedsAttention.value;
  };

  /**
   * Set needs attention filter
   */
  const setNeedsAttention = (value) => {
    showNeedsAttention.value = value;
  };

  /**
   * Reset all filters to default
   */
  const resetFilters = () => {
    searchTerm.value = "";
    statusFilter.value = "All";
    priorityFilter.value = "All";
    sortOrder.value = "newest";
    showNeedsAttention.value = false;
  };

  /**
   * Export filtered requests as CSV
   */
  const exportCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Customer",
      "Status",
      "Priority",
      "Created",
      "Updated",
    ];

    const rows = filteredRequests.value.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`, // Escape quotes
      r.customer,
      r.status,
      r.priority,
      new Date(r.createdAt).toLocaleDateString(),
      new Date(r.updatedAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `support-requests-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return {
    // State
    searchTerm,
    statusFilter,
    priorityFilter,
    sortOrder,
    showNeedsAttention,

    // Getters
    filteredRequests,
    filteredCount,
    hasActiveFilters,
    isEmpty,

    // Actions
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setSortOrder,
    toggleNeedsAttention,
    setNeedsAttention,
    resetFilters,
    exportCSV,
  };
});
