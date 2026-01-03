import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRequestsStore } from "./requests.js";

export const useFiltersStore = defineStore("filters", () => {
  const router = useRouter();
  const route = useRoute();

  // ========================================
  // STATE
  // ========================================
  const searchTerm = ref(route.query.search || "");
  const statusFilter = ref(route.query.status || "All");
  const priorityFilter = ref(route.query.priority || "All");
  const sortOrder = ref(route.query.sort || "newest");
  const showNeedsAttention = ref(route.query.attention === "true");

  // ========================================
  // URL SYNC
  // ========================================
  watch(
    [searchTerm, statusFilter, priorityFilter, sortOrder, showNeedsAttention],
    () => {
      const query = {};

      if (searchTerm.value) query.search = searchTerm.value;
      if (statusFilter.value !== "All") query.status = statusFilter.value;
      if (priorityFilter.value !== "All") query.priority = priorityFilter.value;
      if (sortOrder.value !== "newest") query.sort = sortOrder.value;
      if (showNeedsAttention.value) query.attention = "true";

      router.replace({ query });
    },
    { deep: true }
  );

  // ========================================
  // GETTERS
  // ========================================
  const filteredRequests = computed(() => {
    const requestsStore = useRequestsStore();

    let filtered = [...requestsStore.requests];

    // Search
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title?.toLowerCase().includes(term) ||
          r.customer?.toLowerCase().includes(term) ||
          r.id?.toLowerCase().includes(term)
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

    // Attention filter
    if (showNeedsAttention.value) {
      filtered = filtered.filter((r) => r.attention?.needsAttention);
    }

    // Sorting
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

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (searchTerm.value) count++;
    if (statusFilter.value !== "All") count++;
    if (priorityFilter.value !== "All") count++;
    if (showNeedsAttention.value) count++;
    if (sortOrder.value !== "newest") count++;
    return count;
  });

  // ========================================
  // ACTIONS
  // ========================================
  const setSearch = (term) => {
    searchTerm.value = term;
  };

  const setStatusFilter = (status) => {
    statusFilter.value = status;
  };

  const setPriorityFilter = (priority) => {
    priorityFilter.value = priority;
  };

  const setSortOrder = (order) => {
    sortOrder.value = order;
  };

  const toggleNeedsAttention = () => {
    showNeedsAttention.value = !showNeedsAttention.value;
  };

  const resetFilters = () => {
    searchTerm.value = "";
    statusFilter.value = "All";
    priorityFilter.value = "All";
    sortOrder.value = "newest";
    showNeedsAttention.value = false;
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Customer",
      "Status",
      "Priority",
      "Created",
      "Updated",
      "Needs Attention",
      "Reasons",
    ];

    const rows = filteredRequests.value.map((r) => [
      r.id,
      `"${r.title?.replace(/"/g, '""')}"`,
      r.customer,
      r.status,
      r.priority,
      new Date(r.createdAt).toLocaleDateString("tr-TR"),
      new Date(r.updatedAt).toLocaleDateString("tr-TR"),
      r.attention?.needsAttention ? "YES" : "NO",
      `"${(r.attention?.reasons || []).join("; ")}"`,
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
    activeFiltersCount,

    // Actions
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setSortOrder,
    toggleNeedsAttention,
    resetFilters,
    exportCSV,
  };
});
