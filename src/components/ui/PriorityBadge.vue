<template>
  <span :class="getBadgeClass()" class="px-2 py-1 rounded text-xs font-medium">
    {{ priority }}
  </span>
</template>

<script setup>
const props = defineProps({
  priority: String,
});

const getBadgeClass = () => {
  const classes = {
    Low: 'bg-gray-100 text-gray-700',
    Medium: 'bg-blue-100 text-blue-700',
    High: 'bg-red-100 text-red-700',
  };
  return classes[props.priority];
};
</script>
