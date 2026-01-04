<template>
  <div class="text-center py-12">
    <!-- Loading State -->
    <div v-if="loading">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-4 text-gray-500">Loading requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <div class="text-red-500 mb-4">⚠️ {{ error }}</div>
      <button
        @click="$emit('retry')"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="isEmpty"
      class="border-2 border-dashed border-gray-300 rounded-lg py-12"
    >
      <h3 class="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ emptyMessage }}
      </p>
      <div class="mt-6 space-x-2">
        <button
          v-if="hasActiveFilters"
          @click="$emit('reset-filters')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          Clear Filters
        </button>
        <button
          @click="$emit('generate-data')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
        >
          Generate Sample Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: Boolean,
  error: String,
  isEmpty: Boolean,
  hasActiveFilters: Boolean,
});

defineEmits(['retry', 'reset-filters', 'generate-data']);

const emptyMessage = computed(() => {
  return props.hasActiveFilters
    ? 'Try adjusting your filters or clear all filters to see all requests.'
    : 'No support requests available. Generate sample data to get started.';
});
</script>
