import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRequestsStore } from "./requests";
import { calculateNeedsAttention } from "../utils/dataUtils";

export const useFiltersStore = defineStore("filters", () => {
  const router = useRouter();
  const route = useRoute();

  // ========================================
  // STATE - Initialize from URL query params
  // ========================================
  const searchTerm = ref(route.query.search || "");
  const statusFilter = ref(route.query.status || "All");
  const priorityFilter = ref(route.query.priority || "All");
  const sortOrder = ref(route.query.sort || "newest");
  const showNeedsAttention = ref(route.query.attention === "true");

  // ========================================
  // SYNC STATE TO URL
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

      // Update URL without navigation
      router.replace({ query });
    }
  );

  // ========================================
  // GETTERS
  // ========================================
  const filteredRequests = computed(() => {
    const requestsStore = useRequestsStore();
    let filtered = [...requestsStore.requests];

    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.customer.toLowerCase().includes(term) ||
          r.id.toLowerCase().includes(term)
      );
    }

    if (statusFilter.value !== "All") {
      filtered = filtered.filter((r) => r.status === statusFilter.value);
    }

    if (priorityFilter.value !== "All") {
      filtered = filtered.filter((r) => r.priority === priorityFilter.value);
    }

    if (showNeedsAttention.value) {
      filtered = filtered.filter(
        (r) => calculateNeedsAttention(r).needsAttention
      );
    }

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

  const setNeedsAttention = (value) => {
    showNeedsAttention.value = value;
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
    ];

    const rows = filteredRequests.value.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
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
    searchTerm,
    statusFilter,
    priorityFilter,
    sortOrder,
    showNeedsAttention,
    filteredRequests,
    filteredCount,
    hasActiveFilters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setSortOrder,
    setNeedsAttention,
    resetFilters,
    exportCSV,
  };
});
