<template>
  <div v-if="showAttention" class="flex flex-wrap gap-1">
    <span
      v-for="(reason, i) in attention.reasons"
      :key="i"
      class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium shadow-sm"
      :title="reason"
    >
      {{ shortReason(reason) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  request: {
    type: Object,
    required: true,
  },
});

const attention = computed(
  () => props.request.attention || { needsAttention: false, reasons: [] }
);

const showAttention = computed(() => attention.value.needsAttention);

const shortReason = (reason) => {
  const shortNames = {
    'High priority': 'High',
    'Aging request': 'Old',
    'No recent activity': 'Stale',
  };
  return shortNames[reason] || reason;
};
</script>
