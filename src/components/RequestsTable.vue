<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div v-if="requests.length === 0" class="text-center py-12">
      <AlertIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <p class="text-gray-500">No requests found</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Title
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Customer
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Priority
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Created
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
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
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ request.id }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ request.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
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
              <AttentionBadges :request="request" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from "./StatusBadge.vue";
import PriorityBadge from "./PriorityBadge.vue";
import AttentionBadges from "./AttentionBadges.vue";
import AlertIcon from "./icons/AlertIcon.vue";

defineProps({
  requests: Array,
});

defineEmits(["open-detail"]);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};
</script>
