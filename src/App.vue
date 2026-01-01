<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <LoadingState v-if="requestsStore.loading" />

    <!-- Error State -->
    <ErrorState
      v-else-if="requestsStore.error"
      :error="requestsStore.error"
      @retry="requestsStore.retry"
    />

    <!-- Main Application -->
    <template v-else>
      <AppHeader />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- List View -->
        <div v-if="uiStore.activeView === 'list'">
          <FilterPanel />
          <RequestsTable />
        </div>

        <!-- Chart View -->
        <ChartView v-else />
      </div>

      <!-- Detail Modal -->
      <RequestDetail v-if="uiStore.isDetailModalOpen" />
    </template>
  </div>
</template>

<script setup>
import { useRequestsStore } from "./stores/requests";
import { useFiltersStore } from "./stores/filters";
import { useUIStore } from "./stores/ui";

// Components
import AppHeader from "./components/AppHeader.vue";
import FilterPanel from "./components/FilterPanel.vue";
import RequestsTable from "./components/RequestsTable.vue";
import ChartView from "./components/ChartView.vue";
import RequestDetail from "./components/RequestDetail.vue";
import LoadingState from "./components/LoadingState.vue";
import ErrorState from "./components/ErrorState.vue";

// Initialize stores
const requestsStore = useRequestsStore();
const filtersStore = useFiltersStore();
const uiStore = useUIStore();
</script>
