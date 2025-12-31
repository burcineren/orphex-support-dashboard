<template>
  <div v-if="attention.needsAttention" class="flex flex-wrap gap-1">
    <span
      v-for="(reason, i) in attention.reasons"
      :key="i"
      class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
    >
      {{ reason }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { calculateNeedsAttention } from "../utils/dataUtils";

const props = defineProps({
  request: Object,
});

const attention = computed(() => calculateNeedsAttention(props.request));
</script>
