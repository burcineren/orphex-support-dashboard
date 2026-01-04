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

    <!-- State Display -->
    <StateDisplay
      v-if="loading || error || filteredRequests.length === 0"
      :loading="loading"
      :error="error"
      :is-empty="filteredRequests.length === 0"
      :has-active-filters="hasActiveFilters"
      @retry="retry"
      @reset-filters="resetFilters"
      @generate-data="resetData"
    />

    <!-- Table and Pagination -->
    <div v-else>
      <RequestsTable :requests="paginatedData" />
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
import { storeToRefs } from 'pinia';
import { useRequestsStore } from '@/stores/requests';
import { useFiltersStore } from '@/stores/filters';
import { usePagination } from '@/composables/usePagination';
import FilterPanel from '@/components/pages/requests/FilterPanel.vue';
import RequestsTable from '@/components/pages/requests/RequestsTable.vue';
import PaginationControls from '@/components/ui/PaginationControls.vue';
import StateDisplay from '@/components/ui/StateDisplay.vue';

const requestsStore = useRequestsStore();
const filtersStore = useFiltersStore();

const { loading, error } = storeToRefs(requestsStore);
const { filteredRequests, hasActiveFilters } = storeToRefs(filtersStore);

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
</script>
