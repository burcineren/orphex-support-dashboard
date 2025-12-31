<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader
      :filtered-count="filteredRequests.length"
      :total-count="requests.length"
      :active-view="activeView"
      @update:activeView="activeView = $event"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- List View -->
      <div v-if="activeView === 'list'">
        <FilterPanel
          v-model:search="searchTerm"
          v-model:status="statusFilter"
          v-model:sort="sortOrder"
          v-model:needs-attention="showNeedsAttention"
          @export="exportCSV"
        />

        <RequestsTable :requests="filteredRequests" @open-detail="openDetail" />
      </div>

      <!-- Chart View -->
      <ChartView v-else :requests="requests" />
    </div>

    <!-- Detail Modal -->
    <RequestDetail
      v-if="selectedRequest"
      :request="selectedRequest"
      @close="closeDetail"
      @save="saveChanges"
      @add-comment="addComment"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import AppHeader from "./components/AppHeader.vue";
import FilterPanel from "./components/FilterPanel.vue";
import RequestsTable from "./components/RequestsTable.vue";
import ChartView from "./components/ChartView.vue";
import RequestDetail from "./components/RequestDetail.vue";
import { generateMockData, calculateNeedsAttention } from "./utils/dataUtils";

// State
const requests = ref([]);
const searchTerm = ref("");
const statusFilter = ref("All");
const sortOrder = ref("newest");
const showNeedsAttention = ref(false);
const activeView = ref("list");
const selectedRequest = ref(null);

// Initialize data
const initData = () => {
  const stored = localStorage.getItem("orphex_requests");
  if (stored) {
    requests.value = JSON.parse(stored);
  } else {
    requests.value = generateMockData();
    localStorage.setItem("orphex_requests", JSON.stringify(requests.value));
  }
};

// Save to localStorage
watch(
  requests,
  (newRequests) => {
    localStorage.setItem("orphex_requests", JSON.stringify(newRequests));
  },
  { deep: true }
);

// Filtered requests (immutable operations)
const filteredRequests = computed(() => {
  let filtered = [...requests.value];

  // Search
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.customer.toLowerCase().includes(term)
    );
  }

  // Status filter
  if (statusFilter.value !== "All") {
    filtered = filtered.filter((r) => r.status === statusFilter.value);
  }

  // Needs attention filter
  if (showNeedsAttention.value) {
    filtered = filtered.filter(
      (r) => calculateNeedsAttention(r).needsAttention
    );
  }

  // Sort (create new array to avoid mutation)
  filtered = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder.value === "newest" ? dateB - dateA : dateA - dateB;
  });

  return filtered;
});

// CSV Export
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
    `"${r.title}"`,
    r.customer,
    r.status,
    r.priority,
    new Date(r.createdAt).toLocaleDateString(),
    new Date(r.updatedAt).toLocaleDateString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `support-requests-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Detail operations
const openDetail = (request) => {
  selectedRequest.value = request;
};

const closeDetail = () => {
  selectedRequest.value = null;
};

const saveChanges = ({ status, priority }) => {
  const index = requests.value.findIndex(
    (r) => r.id === selectedRequest.value.id
  );
  if (index !== -1) {
    requests.value[index] = {
      ...requests.value[index],
      status,
      priority,
      updatedAt: new Date().toISOString(),
    };
  }
  closeDetail();
};

const addComment = (comment) => {
  const index = requests.value.findIndex(
    (r) => r.id === selectedRequest.value.id
  );
  if (index !== -1) {
    const updatedRequest = {
      ...requests.value[index],
      comments: [
        ...(requests.value[index].comments || []),
        { text: comment, date: new Date().toISOString() },
      ],
      lastCommentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requests.value[index] = updatedRequest;
    selectedRequest.value = updatedRequest;
  }
};

// Initialize
initData();
</script>
