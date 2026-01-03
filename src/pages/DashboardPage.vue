<template>
  <div>
    <FilterPanel />

    <!-- Results summary -->
    <div
      v-if="!loading && !error && filteredRequests.length > 0"
      class="mb-4 p-4 bg-gray-50 rounded-lg"
    >
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-700">
          Showing {{ filteredRequests.length }} of
          {{ requestsStore.totalCount }} requests
          <span v-if="filtersStore.hasActiveFilters" class="ml-2 text-blue-600">
            ({{ filtersStore.activeFiltersCount }} filters active)
          </span>
        </span>
        <button
          @click="resetFilters"
          v-if="hasActiveFilters"
          class="px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading/Error/Empty States -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-4 text-gray-500">Loading requests...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">⚠️ {{ error }}</div>
      <button
        @click="retry"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="filteredRequests.length === 0"
      class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 20l-5.447-2.724A1 1 0 013 17.276V11h18v6.276a1 1 0 01-.553.894L15 20z"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          hasActiveFilters
            ? "Try adjusting your filters or clear all filters to see all requests."
            : "No support requests available. Generate sample data to get started."
        }}
      </p>
      <div class="mt-6 space-x-2">
        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          Clear Filters
        </button>
        <button
          @click="requestsStore.resetData"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
        >
          Generate Sample Data
        </button>
      </div>
    </div>

    <!-- Table -->
    <RequestsTable
      v-else
      :requests="paginatedRequests"
      :page-size="pageSize"
      :current-page="currentPage"
      @open-detail="openDetail"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRequestsStore } from "../stores/requests";
import { useFiltersStore } from "../stores/filters";
import { useUIStore } from "../stores/ui";
import FilterPanel from "../components/FilterPanel.vue";
import RequestsTable from "../components/RequestsTable.vue";

const requestsStore = useRequestsStore();
const filtersStore = useFiltersStore();
const uiStore = useUIStore();

const { loading, error, totalCount } = storeToRefs(requestsStore);
const { filteredRequests, hasActiveFilters, activeFiltersCount } =
  storeToRefs(filtersStore);

const { retry, resetData } = requestsStore;
const { resetFilters } = filtersStore;

const pageSize = ref(10);
const currentPage = ref(1);

// Pagination
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRequests.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredRequests.value.length / pageSize.value)
);

const hasNextPage = computed(() => currentPage.value < totalPages.value);
const hasPrevPage = computed(() => currentPage.value > 1);

// Pagination actions
const nextPage = () => {
  if (hasNextPage.value) currentPage.value++;
};
const prevPage = () => {
  if (hasPrevPage.value) currentPage.value--;
};

// Reset page on filter change
watch(
  filteredRequests,
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

const openDetail = (request) => {
  uiStore.openDetail(request.id);
};
</script>
