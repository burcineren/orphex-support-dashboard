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
          Showing {{ paginatedData.length }} of
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

    <!-- Table and Pagination -->
    <div v-else>
      <RequestsTable :requests="paginatedData" @open-detail="openDetail" />
      <PaginationControls
        :current-page="currentPage"
        :total-pages="totalPages"
        :has-next-page="hasNextPage"
        :has-prev-page="hasPrevPage"
        @next-page="nextPage"
        @prev-page="prevPage"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRequestsStore } from "@/stores/requests";
import { useFiltersStore } from "@/stores/filters";
import { useUIStore } from "@/stores/ui";
import { usePagination } from "@/composables/usePagination";
import FilterPanel from "@/components/requests/FilterPanel.vue";
import RequestsTable from "@/components/requests/RequestsTable.vue";
import PaginationControls from "@/components/ui/PaginationControls.vue";

const requestsStore = useRequestsStore();
const filtersStore = useFiltersStore();
const uiStore = useUIStore();

const { loading, error } = storeToRefs(requestsStore);
const { filteredRequests, hasActiveFilters, activeFiltersCount } =
  storeToRefs(filtersStore);

const { retry, resetData } = requestsStore;
const { resetFilters } = filtersStore;

const {
  currentPage,
  totalPages,
  paginatedData,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
} = usePagination(filteredRequests, 20);

const openDetail = (request) => {
  uiStore.openDetail(request.id);
};
</script>
