import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { generateMockData, calculateNeedsAttention } from "../utils/dataUtils";

export const useRequestsStore = defineStore("requests", () => {
  // ========================================
  // STATE
  // ========================================
  const requests = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ========================================
  // GETTERS
  // ========================================
  const totalCount = computed(() => requests.value.length);

  const getRequestById = computed(() => (id) => {
    return requests.value.find((r) => r.id === id);
  });

  const requestsByStatus = computed(() => {
    return requests.value.reduce((acc, request) => {
      if (!acc[request.status]) {
        acc[request.status] = [];
      }
      acc[request.status].push(request);
      return acc;
    }, {});
  });

  const requestsByPriority = computed(() => {
    return requests.value.reduce((acc, request) => {
      if (!acc[request.priority]) {
        acc[request.priority] = [];
      }
      acc[request.priority].push(request);
      return acc;
    }, {});
  });

  const statusCounts = computed(() => {
    return requests.value.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
  });

  const priorityCounts = computed(() => {
    return requests.value.reduce((acc, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {});
  });

  const needsAttentionRequests = computed(() => {
    return requests.value.filter(
      (r) => calculateNeedsAttention(r).needsAttention
    );
  });

  // ========================================
  // ACTIONS
  // ========================================

  const initData = async () => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const stored = localStorage.getItem("orphex_requests");

      if (stored) {
        requests.value = JSON.parse(stored);
      } else {
        requests.value = generateMockData();
        saveToLocalStorage();
      }
    } catch (e) {
      error.value = "Failed to load data. Please try again.";
      console.error("Data initialization error:", e);
    } finally {
      loading.value = false;
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("orphex_requests", JSON.stringify(requests.value));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  };

  const updateRequest = (id, updates) => {
    const index = requests.value.findIndex((r) => r.id === id);

    if (index === -1) {
      console.warn(`Request with id ${id} not found`);
      return false;
    }

    requests.value[index] = {
      ...requests.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveToLocalStorage();
    return true;
  };

  const updateStatus = (id, status) => {
    return updateRequest(id, { status });
  };

  const updatePriority = (id, priority) => {
    return updateRequest(id, { priority });
  };

  const addComment = (id, commentText) => {
    const index = requests.value.findIndex((r) => r.id === id);

    if (index === -1) {
      console.warn(`Request with id ${id} not found`);
      return false;
    }

    const comment = {
      text: commentText,
      date: new Date().toISOString(),
    };

    requests.value[index] = {
      ...requests.value[index],
      comments: [...(requests.value[index].comments || []), comment],
      lastCommentAt: comment.date,
      updatedAt: comment.date,
    };

    saveToLocalStorage();
    return true;
  };

  const deleteRequest = (id) => {
    const index = requests.value.findIndex((r) => r.id === id);

    if (index === -1) {
      console.warn(`Request with id ${id} not found`);
      return false;
    }

    requests.value.splice(index, 1);
    saveToLocalStorage();
    return true;
  };

  const createRequest = (requestData) => {
    const newRequest = {
      id: `REQ-${String(requests.value.length + 1).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastCommentAt: null,
      comments: [],
      ...requestData,
    };

    requests.value.push(newRequest);
    saveToLocalStorage();
    return newRequest;
  };

  const retry = () => {
    return initData();
  };

  const resetData = () => {
    requests.value = generateMockData();
    saveToLocalStorage();
  };

  const clearData = () => {
    requests.value = [];
    localStorage.removeItem("orphex_requests");
  };

  // ========================================
  // WATCHERS
  // ========================================

  watch(
    requests,
    () => {
      saveToLocalStorage();
    },
    { deep: true }
  );

  // ========================================
  // INITIALIZATION
  // ========================================
  initData();

  return {
    // State
    requests,
    loading,
    error,

    // Getters
    totalCount,
    getRequestById,
    requestsByStatus,
    requestsByPriority,
    statusCounts,
    priorityCounts,
    needsAttentionRequests,

    // Actions
    initData,
    updateRequest,
    updateStatus,
    updatePriority,
    addComment,
    deleteRequest,
    createRequest,
    retry,
    resetData,
    clearData,
  };
});
