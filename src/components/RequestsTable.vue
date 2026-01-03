<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div v-if="loading" class="p-8 text-center text-gray-500">
      Loading requests...
    </div>
    <div v-else-if="error" class="p-8 text-center text-red-500">
      {{ error }}
      <button
        @click="retry"
        class="ml-2 px-4 py-1 bg-red-500 text-white rounded"
      >
        Retry
      </button>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Priority
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Alerts
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="request in paginatedRequests"
            :key="request.id"
            @click="$emit('open-detail', request)"
            :class="[
              'hover:bg-gray-50 cursor-pointer transition-colors',
              {
                'bg-yellow-50 border-l-4 border-l-yellow-400':
                  request.attention?.needsAttention,
              },
            ]"
            role="button"
            tabindex="0"
            @keydown.enter="$emit('open-detail', request)"
            @keydown.space.prevent="$emit('open-detail', request)"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ request.id }}
            </td>
            <td
              class="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate"
            >
              {{ request.title }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
              {{ request.customer }}
            </td>
            <td class="px-6 py-4">
              <StatusBadge :status="request.status" />
            </td>
            <td class="px-6 py-4">
              <PriorityBadge :priority="request.priority" />
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatDate(request.createdAt) }}
            </td>
            <td class="px-6 py-4">
              <AttentionBadges v-if="request.attention" :request="request" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-if="!loading && !error && requests.length === 0"
        class="p-12 text-center text-gray-500"
      >
        No requests found.
        <button @click="resetData" class="text-blue-600 hover:underline">
          Generate sample data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRequestsStore } from "@/stores/requests.js";
import StatusBadge from "./StatusBadge.vue";
import PriorityBadge from "./PriorityBadge.vue";
import AttentionBadges from "./AttentionBadges.vue";

const props = defineProps({
  requests: {
    type: Array,
    default: () => [],
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["open-detail"]);

const store = useRequestsStore();
const currentPage = ref(1);

// Pagination
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  const end = start + props.pageSize;
  return props.requests.slice(start, end);
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const retry = () => store.retry();
const resetData = () => store.resetData();

defineExpose({
  nextPage: () => currentPage.value++,
  prevPage: () => currentPage.value--,
  goToPage: (page) => (currentPage.value = page),
});
</script>
