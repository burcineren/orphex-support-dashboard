<template>
  <span :class="getBadgeClass()" class="px-2 py-1 rounded text-xs font-medium">
    {{ status }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: String,
});

const getBadgeClass = () => {
  const classes = {
    New: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Waiting on Customer": "bg-orange-100 text-orange-700",
    Done: "bg-green-100 text-green-700",
  };
  return classes[props.status] || "";
};
</script>
