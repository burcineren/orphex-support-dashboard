<template>
  <div class="flex items-center justify-between mt-6">
    <div>
      <p class="text-sm text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="$emit('prev-page')"
        :disabled="!hasPrevPage"
        class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="$emit('next-page')"
        :disabled="!hasNextPage"
        class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number,
  hasNextPage: Boolean,
  hasPrevPage: Boolean,
});

defineEmits(['prev-page', 'next-page']);
</script>
