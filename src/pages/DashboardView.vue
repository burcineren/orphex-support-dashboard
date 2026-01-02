<template>
  <div>
    <FilterPanel />
    <div v-if="loading" class="text-center py-12">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
      <button
        @click="retry"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
    <div
      v-else-if="filteredRequests.length === 0"
      class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg"
    >
      <h3 class="text-lg font-medium text-gray-900">No requests found</h3>
      <p class="mt-1 text-sm text-gray-500">
        There are no support requests matching your criteria.
      </p>
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear filters
      </button>
    </div>
    <RequestsTable
      v-else
      :requests="filteredRequests"
      @open-detail="openDetail"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRequestsStore } from "../stores/requests";
import { useFiltersStore } from "../stores/filters";
import { useUIStore } from "../stores/ui";
import FilterPanel from "../components/FilterPanel.vue";
import RequestsTable from "../components/RequestsTable.vue";

const requestsStore = useRequestsStore();
const filtersStore = useFiltersStore();
const uiStore = useUIStore();

const { loading, error } = storeToRefs(requestsStore);
const { filteredRequests, hasActiveFilters } = storeToRefs(filtersStore);

const { retry } = requestsStore;
const { resetFilters } = filtersStore;

const openDetail = (request) => {
  uiStore.openDetail(request.id);
};
</script>
