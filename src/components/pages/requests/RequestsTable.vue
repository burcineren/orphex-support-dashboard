<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
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
            v-for="request in requests"
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
    </div>
  </div>
</template>

<script setup>
import PriorityBadge from "@/components/ui/PriorityBadge.vue";
import AttentionBadges from "@/components/ui/AttentionBadges.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";

defineProps({
  requests: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["open-detail"]);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>
